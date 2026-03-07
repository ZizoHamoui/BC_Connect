require("dotenv").config();

const connectDB = require("../config/db");
const Business = require("../models/Business");

const seedBusinesses = [
  {
    name: "Rainforest AI",
    industry: "Technology",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Satellite imagery and machine learning to monitor old-growth forest health across BC.",
    tags: ["Clean Energy"],
    employees: 24,
    verificationStatus: "verified",
  },
  {
    name: "Tidal Works",
    industry: "Clean Energy",
    region: "Vancouver Island/Coast",
    city: "Victoria",
    description:
      "Modular tidal turbine systems with low ecological impact for coastal communities.",
    employees: 18,
    verificationStatus: "verified",
  },
  {
    name: "Orca Health",
    industry: "Health & Life",
    region: "Thompson-Okanagan",
    city: "Kelowna",
    description:
      "AI diagnostics platform connecting rural BC communities with telemedicine services.",
    employees: 32,
    verificationStatus: "verified",
  },
];

async function seed() {
  try {
    await connectDB();
    await Business.deleteMany({});
    await Business.insertMany(seedBusinesses);
    console.log(`Seeded ${seedBusinesses.length} businesses.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
