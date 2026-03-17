const Business = require("../models/Business");

async function getAll(req, res) {
  try {
    const { industry, region, city, search, limit = 100 } = req.query;
    const query = {};

    if (industry) query.industry = industry;
    if (region) query.region = region;
    if (city) query.city = city;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin) {
      query.verificationStatus = "verified";
    }

    const businesses = await Business.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 100, 200));

    return res.json(businesses);
  } catch (error) {
    console.error("Get businesses failed:", error);
    return res.status(500).json({ message: "Unable to fetch businesses." });
  }
}

async function getById(req, res) {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    return res.json(business);
  } catch (error) {
    console.error("Get business by id failed:", error);
    return res.status(500).json({ message: "Unable to fetch business." });
  }
}

async function create(req, res) {
  try {
    const { name, industry, region, city, description } = req.body;

    if (!name || !industry || !region || !city || !description) {
      return res.status(400).json({
        message: "name, industry, region, city, and description are required.",
      });
    }

    const isAdmin = req.user.role === "admin";
    const business = await Business.create({
      ...req.body,
      createdBy: req.user.id,
      verificationStatus: isAdmin ? (req.body.verificationStatus || "verified") : "pending",
    });

    return res.status(201).json(business);
  } catch (error) {
    console.error("Create business failed:", error);
    return res.status(500).json({ message: "Unable to create business." });
  }
}

async function remove(req, res) {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const ownerId = business.createdBy ? String(business.createdBy) : null;
    const requestUserId = String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (ownerId && ownerId !== requestUserId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this business." });
    }

    await business.deleteOne();
    return res.status(204).send();
  } catch (error) {
    console.error("Delete business failed:", error);
    return res.status(500).json({ message: "Unable to delete business." });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
};
