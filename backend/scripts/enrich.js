require("dotenv").config();

const connectDB = require("../config/db");
const Business = require("../models/Business");

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? Number(args[limitIdx + 1]) || Infinity : Infinity;

const GOOGLE_KG_KEY = process.env.GOOGLE_KG_API_KEY || "";

if (!GOOGLE_KG_KEY) {
  console.warn(
    "\n⚠  GOOGLE_KG_API_KEY not set in .env — Knowledge Graph discovery disabled.\n"
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const RATE_MS = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function safeFetch(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "BCConnect-Enricher/1.0" },
    });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractDomain(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    const url = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
    );
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Strip common business suffixes for fuzzy matching */
function stripSuffixes(name) {
  return name
    .replace(
      /\b(inc\.?|ltd\.?|llc\.?|co\.?\s*ltd\.?|corp\.?|corporation|limited|incorporated|l\.?l\.?c\.?)\s*$/i,
      ""
    )
    .trim();
}

/**
 * Detect entries that are clearly personal names / sole proprietors.
 * Only skip obvious cases — parenthesized names and "Firstname Lastname & Firstname Lastname".
 */
function isLikelyPersonalName(name) {
  if (!name) return true;
  const trimmed = name.trim();
  // Names in parentheses like "(Barbara Manning)"
  if (/^\(.*\)$/.test(trimmed)) return true;
  // Generic placeholder entries
  if (/^new listing$/i.test(trimmed)) return true;
  // "Firstname M Lastname & Firstname M Lastname" — two personal names joined by &
  // Must look like personal names on BOTH sides of the &
  if (/&/.test(trimmed)) {
    const sides = trimmed.split(/\s*&\s*/);
    const isPersonal = sides.every((side) => {
      const words = side.trim().split(/\s+/);
      return (
        words.length >= 2 &&
        words.length <= 4 &&
        words.every((w) => /^[A-Z][a-z]*\.?$/.test(w))
      );
    });
    if (isPersonal) return true;
  }
  return false;
}

/** Check if a URL is Wikipedia/Wikidata (not a company website) */
function isWikiUrl(url) {
  if (!url) return true;
  return /wikipedia\.org|wikidata\.org/i.test(url);
}

// ---------------------------------------------------------------------------
// Enrichers
// ---------------------------------------------------------------------------

/**
 * Google Knowledge Graph API — free, 100K queries/day.
 * Returns the official website URL (entity.url), NOT the Wikipedia article.
 */
async function fetchWebsite(businessName, city) {
  if (!GOOGLE_KG_KEY) return null;

  // Try with city first, then without for broader match
  const queries = [
    `${businessName} ${city || ""}`.trim(),
    businessName,
  ];

  for (const query of queries) {
    const encoded = encodeURIComponent(query);
    const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encoded}&key=${GOOGLE_KG_KEY}&limit=5&indent=true`;
    const res = await safeFetch(url);

    if (!res) {
      if (VERBOSE) console.log(`    [KG] fetch failed for "${query}"`);
      continue;
    }

    if (!res.ok) {
      if (VERBOSE) {
        const body = await res.text().catch(() => "");
        console.log(`    [KG] HTTP ${res.status} for "${query}": ${body.slice(0, 200)}`);
      }
      continue;
    }

    try {
      const data = await res.json();
      const elements = data.itemListElement || [];

      if (VERBOSE) {
        console.log(
          `    [KG] "${query}" → ${elements.length} results: ${elements
            .map((el) => `"${el.result?.name}" (url=${el.result?.url || "none"})`)
            .join(", ")}`
        );
      }

      const nameLower = businessName.toLowerCase().trim();
      const stripped = stripSuffixes(nameLower);

      for (const el of elements) {
        const entity = el.result;
        if (!entity) continue;

        const entityName = (entity.name || "").toLowerCase().trim();
        const entityStripped = stripSuffixes(entityName);

        // Flexible name matching
        const nameMatch =
          entityName === nameLower ||
          entityName === stripped ||
          entityStripped === stripped ||
          entityName.includes(stripped) ||
          stripped.includes(entityName) ||
          entityStripped.includes(stripped) ||
          stripped.includes(entityStripped);

        if (!nameMatch) continue;

        // Priority: entity.url (official site) > detailedDescription.url (Wikipedia)
        // Filter out Wikipedia URLs — we want the real website
        const officialUrl = entity.url;
        const wikiUrl = entity.detailedDescription?.url;

        if (officialUrl && !isWikiUrl(officialUrl)) {
          if (VERBOSE) console.log(`    [KG] → official: ${officialUrl}`);
          return officialUrl;
        }
        if (wikiUrl && !isWikiUrl(wikiUrl)) {
          if (VERBOSE) console.log(`    [KG] → from description: ${wikiUrl}`);
          return wikiUrl;
        }

        if (VERBOSE) {
          console.log(
            `    [KG] matched "${entity.name}" but only has wiki URLs (url=${officialUrl}, desc=${wikiUrl})`
          );
        }
      }
    } catch (err) {
      if (VERBOSE) console.log(`    [KG] parse error: ${err.message}`);
    }

    await sleep(RATE_MS);
  }
  return null;
}

/**
 * DuckDuckGo search — completely free, no auth, no billing.
 * Scrapes the DuckDuckGo HTML results page for website URLs.
 */
async function fetchWebsiteDDG(businessName, city) {
  const query = `${businessName} ${city || "BC"}`;
  const encoded = encodeURIComponent(query);
  const url = `https://html.duckduckgo.com/html/?q=${encoded}`;
  const res = await safeFetch(url, 10000);

  if (!res || !res.ok) {
    if (VERBOSE) console.log(`    [DDG] fetch failed for "${businessName}"`);
    return null;
  }

  let html;
  try {
    html = await res.text();
  } catch {
    return null;
  }

  // Extract result URLs from DuckDuckGo HTML
  // DDG wraps links in uddg= parameter or has direct hrefs
  const resultUrls = [];
  const urlPattern = /uddg=(https?%3A%2F%2F[^&"]+)/gi;
  let match;
  while ((match = urlPattern.exec(html)) !== null) {
    try {
      const decoded = decodeURIComponent(match[1]);
      resultUrls.push(decoded);
    } catch {
      // skip malformed URL
    }
  }

  if (VERBOSE) {
    console.log(
      `    [DDG] "${businessName}" → ${resultUrls.length} results: ${resultUrls
        .slice(0, 3)
        .map((u) => extractDomain(u))
        .join(", ")}`
    );
  }

  if (resultUrls.length === 0) return null;

  const nameLower = businessName.toLowerCase().trim();
  const stripped = stripSuffixes(nameLower);

  const skipDomains = [
    "linkedin.com", "facebook.com", "twitter.com", "x.com",
    "instagram.com", "youtube.com", "github.com", "crunchbase.com",
    "bloomberg.com", "yelp.com", "yelp.ca", "bbb.org", "glassdoor.com",
    "indeed.com", "wikipedia.org", "yellowpages.ca", "canada411.ca",
    "google.com", "gov.bc.ca", "duckduckgo.com", "reddit.com",
    "tripadvisor.com", "tripadvisor.ca", "zomato.com", "doordash.com",
    "ubereats.com", "grubhub.com", "nextdoor.com", "mapquest.com",
  ];

  // First pass: find a result whose domain contains part of the business name
  for (const resultUrl of resultUrls) {
    const domain = extractDomain(resultUrl);
    if (!domain) continue;
    if (skipDomains.some((sd) => domain.endsWith(sd))) continue;

    // Check if domain relates to business name
    const domainBase = domain.split(".")[0].toLowerCase();
    const nameWords = stripped.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const domainMatchesName =
      nameWords.some((w) => domainBase.includes(w)) ||
      domainBase.includes(stripped.replace(/\s+/g, "").toLowerCase().slice(0, 8));

    if (domainMatchesName) {
      if (VERBOSE) console.log(`    [DDG] → name match: ${resultUrl}`);
      return resultUrl;
    }
  }

  // Second pass: first non-skip result (likely the business website)
  for (const resultUrl of resultUrls) {
    const domain = extractDomain(resultUrl);
    if (!domain) continue;
    if (skipDomains.some((sd) => domain.endsWith(sd))) continue;
    if (VERBOSE) console.log(`    [DDG] → first result: ${resultUrl}`);
    return resultUrl;
  }

  return null;
}

/**
 * Logo via logo.dev — no auth needed. Falls back to Google favicon.
 */
async function fetchLogo(domain) {
  if (!domain) return null;
  const url = `https://img.logo.dev/${domain}?token=pk_anonymous&size=200`;
  const res = await safeFetch(url);
  if (res && res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.startsWith("image/")) return url;
  }
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/**
 * OrgBook BC API — no auth needed.
 * Tries exact name first, then stripped name (without Inc/Ltd/etc).
 */
async function fetchFoundedYear(businessName) {
  if (!businessName) return null;

  const candidates = [businessName];
  const stripped = stripSuffixes(businessName);
  if (stripped !== businessName) candidates.push(stripped);

  for (const name of candidates) {
    const year = await queryOrgBook(name);
    if (year) return year;
  }
  return null;
}

async function queryOrgBook(name) {
  const encoded = encodeURIComponent(name);
  const url = `https://orgbook.gov.bc.ca/api/v4/search/autocomplete?q=${encoded}&inactive=false&revoked=false`;
  const res = await safeFetch(url);
  if (!res || !res.ok) return null;

  try {
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) return null;

    const nameLower = name.toLowerCase().trim();
    const match =
      results.find((r) =>
        (r.names || []).some(
          (n) => (n.text || "").toLowerCase().trim() === nameLower
        )
      ) || results[0];

    if (match && match.id) {
      const topicUrl = `https://orgbook.gov.bc.ca/api/v4/search/topic?id=${match.id}`;
      const topicRes = await safeFetch(topicUrl);
      if (topicRes && topicRes.ok) {
        const topicData = await topicRes.json();
        const topic = topicData.results?.[0] || topicData;
        const effectiveDate =
          topic.effective_date || topic.create_timestamp;
        if (effectiveDate) {
          const year = new Date(effectiveDate).getFullYear();
          if (year >= 1800 && year <= new Date().getFullYear()) return year;
        }
      }
    }
  } catch {
    // skip
  }
  return null;
}

/**
 * Scrape the company homepage HTML for social media links.
 */
async function fetchSocialLinks(websiteUrl) {
  if (!websiteUrl) return {};
  const url = websiteUrl.startsWith("http")
    ? websiteUrl
    : `https://${websiteUrl}`;
  const res = await safeFetch(url, 10000);
  if (!res || !res.ok) return {};

  let html;
  try {
    html = await res.text();
  } catch {
    return {};
  }

  const links = {};

  const linkedinMatch = html.match(
    /href=["'](https?:\/\/(www\.)?linkedin\.com\/(?:company|in)\/[^"'\s#?]+)/i
  );
  if (linkedinMatch) links.linkedin = linkedinMatch[1];

  const twitterMatch = html.match(
    /href=["'](https?:\/\/(www\.)?(twitter\.com|x\.com)\/[^"'\s#?]+)/i
  );
  if (twitterMatch) links.twitter = twitterMatch[1];

  const githubMatch = html.match(
    /href=["'](https?:\/\/(www\.)?github\.com\/[^"'\s#?]+)/i
  );
  if (githubMatch) links.github = githubMatch[1];

  return links;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function enrich() {
  await connectDB();

  // Fetch the top N businesses as they appear on the frontend directory
  // (verified, newest first) then filter to those needing enrichment
  const topBusinesses = await Business.find({ verificationStatus: "verified" })
    .sort({ createdAt: -1, _id: -1 })
    .limit(LIMIT);

  const businesses = topBusinesses.filter((biz) => {
    const missingWebsite = !biz.contact?.website;
    const missingLogo = !biz.logoUrl;
    const missingFounded = !biz.foundedYear;
    const missingSocials =
      !biz.socialLinks?.linkedin ||
      !biz.socialLinks?.twitter ||
      !biz.socialLinks?.github;
    return missingWebsite || missingLogo || missingFounded || missingSocials;
  });

  const total = businesses.length;
  console.log(
    `\n${DRY_RUN ? "[DRY RUN] " : ""}Found ${total} businesses to enrich.\n`
  );

  let updated = 0;
  let skipped = 0;
  let personalSkipped = 0;
  let websitesFound = 0;

  for (let i = 0; i < total; i++) {
    const biz = businesses[i];
    const prefix = `[${i + 1}/${total}] "${biz.name}"`;

    // --- Skip personal names / sole proprietors ---
    if (isLikelyPersonalName(biz.name)) {
      console.log(`${prefix} ... [skipped — personal name]`);
      personalSkipped++;
      skipped++;
      continue;
    }

    let website = biz.contact?.website || "";
    const changes = {};
    const status = [];

    // --- Step 0: Discover website via Knowledge Graph → DuckDuckGo fallback ---
    if (!website) {
      let discovered = null;

      // Try Knowledge Graph first (free, 100K/day — good for big companies)
      if (GOOGLE_KG_KEY) {
        discovered = await fetchWebsite(biz.name, biz.city);
        await sleep(RATE_MS);
      }

      // Fallback to DuckDuckGo (free, no auth — good for small/local businesses)
      if (!discovered) {
        discovered = await fetchWebsiteDDG(biz.name, biz.city);
        await sleep(RATE_MS);
      }

      if (discovered) {
        website = discovered;
        changes.contact = {
          email: biz.contact?.email || undefined,
          phone: biz.contact?.phone || undefined,
          website: discovered,
        };
        websitesFound++;
        status.push(`website ✓ (${extractDomain(discovered)})`);
      } else {
        status.push("website ✗");
      }
    } else if (website) {
      status.push(`website (${extractDomain(website)})`);
    } else {
      status.push("website ✗ (no API key)");
    }

    // --- Step 1: Logo ---
    const domain = extractDomain(website);
    if (!biz.logoUrl && domain) {
      const logoUrl = await fetchLogo(domain);
      if (logoUrl) {
        changes.logoUrl = logoUrl;
        status.push("logo ✓");
      } else {
        status.push("logo ✗");
      }
      await sleep(RATE_MS);
    } else if (biz.logoUrl) {
      status.push("logo (exists)");
    } else {
      status.push("logo ✗ (no domain)");
    }

    // --- Step 2: Social links ---
    const existingLinkedin = biz.socialLinks?.linkedin;
    const existingTwitter = biz.socialLinks?.twitter;
    const existingGithub = biz.socialLinks?.github;
    const needsSocials =
      !existingLinkedin || !existingTwitter || !existingGithub;

    if (needsSocials && website) {
      const socials = await fetchSocialLinks(website);
      const newSocials = {};
      if (!existingLinkedin && socials.linkedin)
        newSocials.linkedin = socials.linkedin;
      if (!existingTwitter && socials.twitter)
        newSocials.twitter = socials.twitter;
      if (!existingGithub && socials.github)
        newSocials.github = socials.github;

      if (Object.keys(newSocials).length > 0) {
        changes.socialLinks = {
          linkedin: existingLinkedin || newSocials.linkedin || undefined,
          twitter: existingTwitter || newSocials.twitter || undefined,
          github: existingGithub || newSocials.github || undefined,
        };
        status.push(`socials ✓ (${Object.keys(newSocials).join(", ")})`);
      } else {
        status.push("socials ✗");
      }
      await sleep(RATE_MS);
    } else if (!needsSocials) {
      status.push("socials (exist)");
    } else {
      status.push("socials ✗ (no website)");
    }

    // --- Step 3: Founded year (OrgBook BC with fuzzy matching) ---
    if (!biz.foundedYear) {
      const year = await fetchFoundedYear(biz.name);
      if (year) {
        changes.foundedYear = year;
        status.push(`founded ✓ (${year})`);
      } else {
        status.push("founded ✗");
      }
      await sleep(RATE_MS);
    } else {
      status.push(`founded (${biz.foundedYear})`);
    }

    // --- Apply changes ---
    if (Object.keys(changes).length > 0) {
      console.log(`${prefix} ... ${status.join("  ")}`);
      if (!DRY_RUN) {
        await Business.updateOne({ _id: biz._id }, { $set: changes });
      }
      updated++;
    } else {
      console.log(`${prefix} ... ${status.join("  ")} [no changes]`);
      skipped++;
    }
  }

  console.log(
    `\n${DRY_RUN ? "[DRY RUN] " : ""}Done.` +
      `\n  Updated: ${updated}` +
      `\n  Skipped: ${skipped} (${personalSkipped} personal names)` +
      `\n  Websites discovered: ${websitesFound}` +
      `\n  Total: ${total}\n`
  );
  process.exit(0);
}

enrich().catch((err) => {
  console.error("Enrichment failed:", err);
  process.exit(1);
});
