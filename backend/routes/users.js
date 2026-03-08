const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  getFavorites,
  toggleFavorite,
  updateProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me/favorites", verifyToken, getFavorites);
router.post("/me/favorites", verifyToken, toggleFavorite);
router.patch("/me", verifyToken, updateProfile);

module.exports = router;
