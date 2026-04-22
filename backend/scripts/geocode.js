/**
 * geocode.js — Smart geocoding using OpenStreetMap Nominatim (free, no key needed).
 *
 * Groups businesses by unique city+region, makes ONE geocode call per city,
 * then bulk-updates all matching businesses. For 90k businesses across ~30
 * unique BC cities, this is ~30 API calls total.
 *
 * Usage:
 *   node scripts/geocode.js             (only businesses missing coords)
 *   node scripts/geocode.js --all       (re-geocode everything)
 *   node scripts/geocode.js --dry-run   (preview, no DB writes)
 */

require("dotenv").config();

const mongoose = require("mongoose");
const https = require("https");
const Business = require("../models/Business");

const FORCE_ALL = process.argv.includes("--all");
const DRY_RUN  = process.argv.includes("--dry-run");

// Nominatim requires a User-Agent identifying your app
const USER_AGENT = "BC-Connect-Geocoder/1.0 (IAT459 Project)";

// Nominatim rate limit: max 1 req/s. We'll be conservative with 1.5s delay.
const DELAY_MS = 1500;

// Known coordinates for BC cities/regions as a fallback lookup table
// so the script works even if Nominatim has trouble with unusual names
const KNOWN_BC_COORDS = {
  "Vancouver":       { lat: 49.2827, lng: -123.1207 },
  "Victoria":        { lat: 48.4284, lng: -123.3656 },
  "Burnaby":         { lat: 49.2488, lng: -122.9805 },
  "Surrey":          { lat: 49.1913, lng: -122.8490 },
  "Richmond":        { lat: 49.1666, lng: -123.1336 },
  "Kelowna":         { lat: 49.8880, lng: -119.4960 },
  "Kamloops":        { lat: 50.6745, lng: -120.3273 },
  "Prince George":   { lat: 53.9171, lng: -122.7497 },
  "Abbotsford":      { lat: 49.0504, lng: -122.3045 },
  "Coquitlam":       { lat: 49.2838, lng: -122.7932 },
  "Nanaimo":         { lat: 49.1659, lng: -123.9401 },
  "Chilliwack":      { lat: 49.1579, lng: -121.9514 },
  "Langley":         { lat: 49.1044, lng: -122.6604 },
  "Saanich":         { lat: 48.4849, lng: -123.3695 },
  "Delta":           { lat: 49.0847, lng: -123.0585 },
  "North Vancouver": { lat: 49.3198, lng: -123.0720 },
  "West Vancouver":  { lat: 49.3668, lng: -123.1673 },
  "Maple Ridge":     { lat: 49.2193, lng: -122.5983 },
  "New Westminster": { lat: 49.2057, lng: -122.9110 },
  "Port Coquitlam":  { lat: 49.2625, lng: -122.7811 },
  "Penticton":       { lat: 49.4991, lng: -119.5937 },
  "Vernon":          { lat: 50.2676, lng: -119.2720 },
  "White Rock":      { lat: 49.0212, lng: -122.8026 },
  "Fort St. John":   { lat: 56.2518, lng: -120.8488 },
  "Terrace":         { lat: 54.5151, lng: -128.5984 },
  "Prince Rupert":   { lat: 54.3150, lng: -130.3208 },
  "Cranbrook":       { lat: 49.5128, lng: -115.7701 },
  "Campbell River":  { lat: 50.0163, lng: -125.2445 },
  "Courtenay":       { lat: 49.6888, lng: -124.9956 },
  "Williams Lake":   { lat: 52.1417, lng: -122.1417 },
  "Remote (BC)":     { lat: 53.7267, lng: -127.6476 }, // centre of BC
  // Region fallbacks (when city is a campus/org name)
  "Cariboo":         { lat: 52.1417, lng: -122.1417 },
  "Mainland/Southwest": { lat: 49.2827, lng: -123.1207 },
  "Thompson-Okanagan":{ lat: 50.6745, lng: -120.3273 },
  "Vancouver Island/Coast": { lat: 49.6918, lng: -124.9950 },
  "Nechako":         { lat: 53.9171, lng: -122.7497 },
};

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function nominatimGeocode(query) {
  return new Promise((resolve, reject) => {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(query)}` +
      `&format=json&limit=1&countrycodes=ca`;

    const options = {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en",
      },
    };

    https.get(url, options, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          const results = JSON.parse(body);
          if (results.length > 0) {
            resolve({
              lat: parseFloat(results[0].lat),
              lng: parseFloat(results[0].lon),
            });
          } else {
            resolve(null);
          }
        } catch {
          reject(new Error("Failed to parse Nominatim response"));
        }
      });
    }).on("error", reject);
  });
}

function lookupKnown(city, region) {
  if (city && KNOWN_BC_COORDS[city]) return KNOWN_BC_COORDS[city];
  if (region && KNOWN_BC_COORDS[region]) return KNOWN_BC_COORDS[region];
  return null;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "test",
  });
  console.log("✅  Connected to MongoDB\n");

  const needsGeoQuery = FORCE_ALL
    ? {}
    : {
        $or: [
          { "coordinates.lat": { $exists: false } },
          { "coordinates.lat": null },
          { coordinates: { $exists: false } },
        ],
      };

  const businesses = await Business.find(needsGeoQuery).select(
    "name city region coordinates"
  );
  console.log(`📦  ${businesses.length} businesses need coordinates\n`);

  if (businesses.length === 0) {
    console.log("✅  All businesses already have coordinates.");
    await mongoose.disconnect();
    return;
  }

  // Collect unique city+region pairs
  const cityMap = new Map();
  for (const biz of businesses) {
    const key = `${biz.city || ""}||${biz.region || ""}`;
    if (!cityMap.has(key)) cityMap.set(key, undefined);
  }

  console.log(`🗺️   ${cityMap.size} unique city+region pairs to resolve\n`);

  // Resolve coordinates for each unique pair
  for (const key of cityMap.keys()) {
    const [city, region] = key.split("||");
    process.stdout.write(`  "${city || "?"}, ${region || "?"}"… `);

    // 1. Check our known table first (instant, free)
    const known = lookupKnown(city, region);
    if (known) {
      console.log(`📌  ${known.lat.toFixed(4)}, ${known.lng.toFixed(4)} (known)`);
      cityMap.set(key, known);
      continue;
    }

    // 2. Try Nominatim with city, BC, Canada
    try {
      const query = [city, "British Columbia", "Canada"].filter(Boolean).join(", ");
      const coords = await nominatimGeocode(query);

      if (coords) {
        console.log(`✅  ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        cityMap.set(key, coords);
      } else {
        // 3. Fallback: try region only
        const regionCoords = region
          ? await nominatimGeocode(`${region}, British Columbia, Canada`)
          : null;

        if (regionCoords) {
          console.log(`✅  ${regionCoords.lat.toFixed(4)}, ${regionCoords.lng.toFixed(4)} (region fallback)`);
          cityMap.set(key, regionCoords);
        } else {
          console.log("❌  Not found — will use BC centre");
          cityMap.set(key, { lat: 53.7267, lng: -127.6476 }); // centre of BC
        }
      }

      await sleep(DELAY_MS); // Nominatim rate limit
    } catch (err) {
      console.log(`❌  Error: ${err.message}`);
      cityMap.set(key, { lat: 53.7267, lng: -127.6476 });
    }
  }

  // Bulk-write to MongoDB
  if (DRY_RUN) {
    console.log("\n🔍  Dry-run — no DB writes.\n");
  } else {
    console.log("\n💾  Writing coordinates to MongoDB…\n");
    let written = 0;

    for (const [key, coords] of cityMap.entries()) {
      if (!coords) continue;
      const [city, region] = key.split("||");

      // Build filter matching businesses with this city+region that still need coords
      const filter = {
        ...needsGeoQuery,
        ...(city   ? { city }   : {}),
        ...(region ? { region } : {}),
      };

      const result = await Business.updateMany(filter, {
        $set: {
          "coordinates.lat": coords.lat,
          "coordinates.lng": coords.lng,
        },
      });

      written += result.modifiedCount;
      if (result.modifiedCount > 0) {
        console.log(
          `  ${city || region} → ${result.modifiedCount} updated (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
        );
      }
    }

    console.log(`\n✅  Done! ${written} businesses now have coordinates.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
