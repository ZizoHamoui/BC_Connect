const mongoose = require("mongoose");
const Business = require("../models/Business");

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function normalizeBusinessPayload(body = {}) {
  const industry = normalizeString(body.industry || body.industryCategory);
  const region = normalizeString(body.region);
  const city = normalizeString(body.city);
  const name = normalizeString(body.name);
  const description = normalizeString(body.description);
  const address = normalizeString(body.address);
  const postalCode = normalizeString(body.postalCode);

  return {
    name,
    industry,
    region,
    city,
    address: address || undefined,
    postalCode: postalCode || undefined,
    description,
    employees: normalizeNumber(body.employees),
    tags: Array.isArray(body.tags)
      ? body.tags
          .map((tag) => normalizeString(tag))
          .filter(Boolean)
      : undefined,
    verificationStatus: normalizeString(body.verificationStatus) || undefined,
    contact:
      body.contact && typeof body.contact === "object"
        ? {
            email: normalizeString(body.contact.email) || undefined,
            phone: normalizeString(body.contact.phone) || undefined,
            website: normalizeString(body.contact.website) || undefined,
          }
        : undefined,
    coordinates:
      body.coordinates &&
      typeof body.coordinates === "object" &&
      typeof body.coordinates.lat === "number" &&
      typeof body.coordinates.lng === "number"
        ? {
            lat: body.coordinates.lat,
            lng: body.coordinates.lng,
          }
        : undefined,
  };
}

function handleBusinessWriteError(error, res, fallbackMessage) {
  if (error?.name === "ValidationError") {
    const message =
      Object.values(error.errors || {})[0]?.message || fallbackMessage;
    return res.status(400).json({ message });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({ message: fallbackMessage });
}

async function getAll(req, res) {
  try {
    const industry = normalizeString(
      req.query?.industry || req.query?.industryCategory,
    );
    const region = normalizeString(req.query?.region);
    const city = normalizeString(req.query?.city);
    const search = normalizeString(req.query?.search);
    const rawLimit = normalizeString(req.query?.limit);
    const rawPage = normalizeString(req.query?.page);
    const requestedLimit = Number(rawLimit);
    const requestedPage = Number(rawPage);
    const limit =
      rawLimit.toLowerCase() === "all"
        ? null
        : Number.isFinite(requestedLimit) && requestedLimit > 0
          ? Math.min(requestedLimit, 200)
          : 100;
    const page =
      Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
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

    const businessQuery = Business.find(query).sort({ createdAt: -1 });

    if (limit !== null) {
      businessQuery.skip((page - 1) * limit).limit(limit);
    }

    const businesses = await businessQuery;

    return res.json(businesses);
  } catch (error) {
    console.error("Get businesses failed:", error);
    return res.status(500).json({ message: "Unable to fetch businesses." });
  }
}

async function getById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid business id." });
    }

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
    const payload = normalizeBusinessPayload(req.body);
    const { name, industry, region, city, description } = payload;

    if (!name || !industry || !region || !city || !description) {
      return res.status(400).json({
        message: "name, industry, region, city, and description are required.",
      });
    }

    const business = await Business.create({
      ...payload,
      createdBy: req.user.id,
    });

    return res.status(201).json(business);
  } catch (error) {
    return handleBusinessWriteError(error, res, "Unable to create business.");
  }
}

async function remove(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid business id." });
    }

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
