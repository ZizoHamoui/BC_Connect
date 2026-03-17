const mongoose = require("mongoose");

const adminActionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["approved", "rejected", "deleted"],
      required: true,
    },
    businessName: { type: String, required: true },
    businessIndustry: { type: String },
    businessCity: { type: String },
    businessRegion: { type: String },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminAction", adminActionSchema);
