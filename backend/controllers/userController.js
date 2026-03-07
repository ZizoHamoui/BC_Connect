const User = require("../models/User");

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
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user.toSafeJSON());
  } catch (error) {
    console.error("Update profile failed:", error);
    return res.status(500).json({ message: "Unable to update profile." });
  }
}

module.exports = {
  getFavorites,
  toggleFavorite,
  updateProfile,
};
