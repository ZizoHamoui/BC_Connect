const express = require("express");
const verifyToken = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const {
  getAll,
  getFilterOptions,
  getById,
  create,
  remove,
} = require("../controllers/businessController");

const router = express.Router();

router.get("/", optionalAuth, getAll);
router.get("/filters", optionalAuth, getFilterOptions);
router.get("/:id", optionalAuth, getById);

// Assignment-required protected routes.
router.post("/", verifyToken, create);
router.delete("/:id", verifyToken, remove);

module.exports = router;
