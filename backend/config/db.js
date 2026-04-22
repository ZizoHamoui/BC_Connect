const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "bconnect",
  });

  console.log("MongoDB connected.");
}

module.exports = connectDB;
