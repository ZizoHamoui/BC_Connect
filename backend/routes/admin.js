const express = require("express");
const verifyToken = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  getStats,
  getPendingBusinesses,
  updateBusinessStatus,
  deleteBusiness,
  getActionHistory,
  getAdmins,
  getMembers,
  updateUserRoles,
} = require("../controllers/adminController");

const router = express.Router();

router.use(verifyToken, adminOnly);

router.get("/stats", getStats);
router.get("/businesses/pending", getPendingBusinesses);
router.patch("/businesses/:id/status", updateBusinessStatus);
router.delete("/businesses/:id", deleteBusiness);
router.get("/actions", getActionHistory);
router.get("/admins", getAdmins);
router.get("/members", getMembers);
router.patch("/members/roles", updateUserRoles);

module.exports = router;
