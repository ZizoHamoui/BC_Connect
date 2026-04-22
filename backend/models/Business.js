const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    // Legacy-compatible category field used by existing datasets.
    industryCategory: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    employees: { type: Number, min: 0 },
    tags: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    foundedYear: { type: Number, min: 1800, max: 2100 },
    stage: {
      type: String,
      enum: ["Pre-Seed", "Seed", "Series A", "Series B+", "Growth", "Established"],
    },
    fundingRaised: { type: String, trim: true },
    revenueRange: {
      type: String,
      enum: ["Pre-Revenue", "<$1M", "$1M-$5M", "$5M-$10M", "$10M+"],
    },
    customerCount: { type: Number, min: 0 },
    logoUrl: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
    },
    contact: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Business", businessSchema);
