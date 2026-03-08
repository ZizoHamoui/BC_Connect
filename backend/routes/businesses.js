const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  getAll,
  getById,
  create,
  remove,
} = require("../controllers/businessController");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);

// Assignment-required protected routes.
router.post("/", verifyToken, create);
router.delete("/:id", verifyToken, remove);

module.exports = router;
