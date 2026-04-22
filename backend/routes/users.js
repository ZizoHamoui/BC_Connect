const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  getSavedBusinesses,
  saveBusiness,
  removeSavedBusiness,
  getRecommendations,
  getFavorites,
  toggleFavorite,
  updateProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me/saved", verifyToken, getSavedBusinesses);
router.post("/me/saved", verifyToken, saveBusiness);
router.delete("/me/saved/:businessId", verifyToken, removeSavedBusiness);
router.get("/me/recommendations", verifyToken, getRecommendations);

// Backward-compatible aliases.
router.get("/me/favorites", verifyToken, getFavorites);
router.post("/me/favorites", verifyToken, toggleFavorite);
router.patch("/me", verifyToken, updateProfile);

module.exports = router;
