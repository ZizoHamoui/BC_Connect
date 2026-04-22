const express = require("express");
const verifyToken = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const optionalAuth = require("../middleware/optionalAuth");
const {
  getAll,
  getFilterOptions,
  getById,
  create,
  update,
  remove,
} = require("../controllers/businessController");

const router = express.Router();

router.get("/", optionalAuth, getAll);
router.get("/filters", optionalAuth, getFilterOptions);
router.get("/:id", optionalAuth, getById);

// Assignment-required protected routes.
router.post("/", verifyToken, create);
router.put("/:id", verifyToken, adminOnly, update);
router.delete("/:id", verifyToken, remove);

module.exports = router;
