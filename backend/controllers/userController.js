const mongoose = require("mongoose");
const Business = require("../models/Business");
const User = require("../models/User");

function normalizeUsername(username) {
  return typeof username === "string" ? username.trim() : "";
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function handleUserWriteError(error, res, fallbackMessage) {
  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    return res
      .status(409)
      .json({ message: `${duplicateField} is already in use.` });
  }

  if (error?.name === "ValidationError") {
    const message =
      Object.values(error.errors || {})[0]?.message || fallbackMessage;
    return res.status(400).json({ message });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({ message: fallbackMessage });
}

async function getFavorites(req, res) {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user.favorites || []);
  } catch (error) {
    console.error("Get favorites failed:", error);
    return res.status(500).json({ message: "Unable to fetch favorites." });
  }
}

async function toggleFavorite(req, res) {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: "businessId is required." });
    }

    if (!isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid business id." });
    }

    const business = await Business.findById(businessId).select("_id");

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const exists = user.favorites.some(
      (id) => String(id) === String(businessId),
    );

    if (exists) {
      user.favorites = user.favorites.filter(
        (id) => String(id) !== String(businessId),
      );
    } else {
      user.favorites.push(businessId);
    }

    await user.save();
    return res.json({ favorites: user.favorites, added: !exists });
  } catch (error) {
    console.error("Toggle favorite failed:", error);
    return res.status(500).json({ message: "Unable to update favorites." });
  }
}

async function updateProfile(req, res) {
  try {
    const username = normalizeUsername(req.body?.username);
    const email = normalizeEmail(req.body?.email);
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "Provide username and/or email to update." });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user.toSafeJSON());
  } catch (error) {
    return handleUserWriteError(error, res, "Unable to update profile.");
  }
}

module.exports = {
  getFavorites,
  toggleFavorite,
  updateProfile,
};
