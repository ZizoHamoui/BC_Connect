const User = require("../models/User");
const Business = require("../models/Business");
const AdminAction = require("../models/AdminAction");

async function getStats(req, res) {
  try {
    const now = new Date();
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [businessesThisMonth, businessesLastMonth, totalBusinesses, totalMembers] =
      await Promise.all([
        Business.countDocuments({ createdAt: { $gte: firstOfThisMonth } }),
        Business.countDocuments({
          createdAt: { $gte: firstOfLastMonth, $lt: firstOfThisMonth },
        }),
        Business.countDocuments(),
        User.countDocuments({ role: "member" }),
      ]);

    const monthOverMonthChange =
      businessesLastMonth === 0
        ? businessesThisMonth > 0
          ? 100
          : 0
        : Math.round(
            ((businessesThisMonth - businessesLastMonth) / businessesLastMonth) * 100,
          );

    return res.json({
      businessesThisMonth,
      totalBusinesses,
      monthOverMonthChange,
      totalMembers,
    });
  } catch (error) {
    console.error("Get admin stats failed:", error);
    return res.status(500).json({ message: "Unable to fetch stats." });
  }
}

async function getPendingBusinesses(req, res) {
  try {
    const businesses = await Business.find({ verificationStatus: "pending" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    return res.json(businesses);
  } catch (error) {
    console.error("Get pending businesses failed:", error);
    return res.status(500).json({ message: "Unable to fetch pending businesses." });
  }
}

async function updateBusinessStatus(req, res) {
  try {
    const { status } = req.body;

    if (!status || !["verified", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'status must be "verified" or "rejected".' });
    }

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    business.verificationStatus = status;
    await business.save();

    await AdminAction.create({
      action: status === "verified" ? "approved" : "rejected",
      businessName: business.name,
      businessIndustry: business.industry,
      businessCity: business.city,
      businessRegion: business.region,
      performedBy: req.user.id,
    });

    return res.json(business);
  } catch (error) {
    console.error("Update business status failed:", error);
    return res.status(500).json({ message: "Unable to update business status." });
  }
}

async function getAdmins(req, res) {
  try {
    const admins = await User.find({ role: "admin" }).select("username email createdAt");

    return res.json(admins);
  } catch (error) {
    console.error("Get admins failed:", error);
    return res.status(500).json({ message: "Unable to fetch admins." });
  }
}

async function deleteBusiness(req, res) {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    await AdminAction.create({
      action: "deleted",
      businessName: business.name,
      businessIndustry: business.industry,
      businessCity: business.city,
      businessRegion: business.region,
      performedBy: req.user.id,
    });

    await business.deleteOne();
    return res.status(204).send();
  } catch (error) {
    console.error("Admin delete business failed:", error);
    return res.status(500).json({ message: "Unable to delete business." });
  }
}

async function getActionHistory(req, res) {
  try {
    const actions = await AdminAction.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("performedBy", "username");

    return res.json(actions);
  } catch (error) {
    console.error("Get action history failed:", error);
    return res.status(500).json({ message: "Unable to fetch action history." });
  }
}

async function getMembers(req, res) {
  try {
    const { search } = req.query;
    const query = { role: { $in: ["member", "admin"] } };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const members = await User.find(query)
      .select("username email role createdAt")
      .sort({ username: 1 })
      .limit(100);

    return res.json(members);
  } catch (error) {
    console.error("Get members failed:", error);
    return res.status(500).json({ message: "Unable to fetch members." });
  }
}

async function updateUserRoles(req, res) {
  try {
    const { changes } = req.body;

    if (!Array.isArray(changes) || changes.length === 0) {
      return res.status(400).json({ message: "changes array is required." });
    }

    const results = [];

    for (const { userId, role } of changes) {
      if (!userId || !["member", "admin"].includes(role)) {
        continue;
      }

      const user = await User.findById(userId);
      if (!user) continue;

      // Prevent an admin from demoting themselves
      if (String(user._id) === String(req.user.id) && role !== "admin") {
        continue;
      }

      user.role = role;
      await user.save();
      results.push(user.toSafeJSON());
    }

    return res.json({ updated: results });
  } catch (error) {
    console.error("Update user roles failed:", error);
    return res.status(500).json({ message: "Unable to update roles." });
  }
}

module.exports = {
  getStats,
  getPendingBusinesses,
  updateBusinessStatus,
  deleteBusiness,
  getActionHistory,
  getAdmins,
  getMembers,
  updateUserRoles,
};
