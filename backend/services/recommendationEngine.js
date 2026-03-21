const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "bc",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "to",
  "with",
]);

function normalize(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function increment(map, key, value = 1) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + value);
}

function tokenize(text) {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function buildPreferenceProfile(savedBusinesses = []) {
  const industries = new Map();
  const regions = new Map();
  const cities = new Map();
  const tags = new Map();
  const keywords = new Map();

  for (const business of savedBusinesses) {
    increment(industries, normalize(business.industry || business.industryCategory), 1.5);
    increment(regions, normalize(business.region), 1);
    increment(cities, normalize(business.city), 0.75);

    for (const tag of business.tags || []) {
      increment(tags, normalize(tag), 1.25);
    }

    for (const token of tokenize(`${business.name || ""} ${business.description || ""}`)) {
      increment(keywords, token, 1);
    }
  }

  const topKeywords = new Set(
    [...keywords.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([token]) => token),
  );

  return {
    industries,
    regions,
    cities,
    tags,
    topKeywords,
  };
}

function scoreCandidate(candidate, profile) {
  let score = 0;
  const reasons = [];
  const industry = normalize(candidate.industry || candidate.industryCategory);
  const region = normalize(candidate.region);
  const city = normalize(candidate.city);
  const candidateTags = (candidate.tags || []).map((tag) => normalize(tag));
  const candidateTokens = new Set(
    tokenize(
      `${candidate.name || ""} ${candidate.description || ""} ${candidateTags.join(" ")}`,
    ),
  );

  if (industry && profile.industries.has(industry)) {
    const weight = profile.industries.get(industry);
    score += weight * 4.5;
    reasons.push(`Matches your saved industry focus: ${candidate.industry}.`);
  }

  if (region && profile.regions.has(region)) {
    const weight = profile.regions.get(region);
    score += weight * 2.25;
    reasons.push(`Located in a region you save frequently (${candidate.region}).`);
  }

  if (city && profile.cities.has(city)) {
    const weight = profile.cities.get(city);
    score += weight * 1.5;
  }

  let tagOverlap = 0;
  for (const tag of candidateTags) {
    if (profile.tags.has(tag)) {
      tagOverlap += profile.tags.get(tag);
    }
  }
  if (tagOverlap > 0) {
    score += tagOverlap * 1.8;
    reasons.push("Shares similar tags with your saved businesses.");
  }

  let keywordOverlap = 0;
  for (const token of candidateTokens) {
    if (profile.topKeywords.has(token)) {
      keywordOverlap += 1;
    }
  }
  if (keywordOverlap > 0) {
    score += keywordOverlap * 1.15;
  }

  if (candidate.verificationStatus === "verified") {
    score += 0.65;
  }

  return {
    score,
    reasons: reasons.slice(0, 2),
  };
}

function byQuality(a, b) {
  const aVerified = a.verificationStatus === "verified" ? 1 : 0;
  const bVerified = b.verificationStatus === "verified" ? 1 : 0;

  if (bVerified !== aVerified) {
    return bVerified - aVerified;
  }

  return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
}

function buildRecommendations({ savedBusinesses = [], candidates = [], limit = 3 }) {
  const availableCandidates = candidates.filter(Boolean);
  if (availableCandidates.length === 0 || limit <= 0) {
    return [];
  }

  if (!savedBusinesses.length) {
    return [...availableCandidates]
      .sort(byQuality)
      .slice(0, limit)
      .map((business) => ({
        business,
        score: 0,
        reasons: ["Save businesses to unlock higher-personalization recommendations."],
      }));
  }

  const profile = buildPreferenceProfile(savedBusinesses);
  const scored = availableCandidates
    .map((candidate) => ({
      candidate,
      ...scoreCandidate(candidate, profile),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return byQuality(a.candidate, b.candidate);
    });

  const topScored = scored.filter((item) => item.score > 0).slice(0, limit);
  const selectedIds = new Set(topScored.map((item) => String(item.candidate._id)));

  if (topScored.length < limit) {
    const fallback = [...availableCandidates]
      .sort(byQuality)
      .filter((candidate) => !selectedIds.has(String(candidate._id)))
      .slice(0, limit - topScored.length)
      .map((candidate) => ({
        candidate,
        score: 0.1,
        reasons: ["Popular in the BC directory and currently relevant to your profile."],
      }));

    topScored.push(...fallback);
  }

  return topScored.slice(0, limit).map(({ candidate, score, reasons }) => ({
    business: candidate,
    score: Number(score.toFixed(3)),
    reasons,
  }));
}

module.exports = {
  buildRecommendations,
};
