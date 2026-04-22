const mongoose = require("mongoose");
const Business = require("../models/Business");
const AdminAction = require("../models/AdminAction");

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

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactCaseInsensitive(field, value) {
  const escapedValue = escapeRegex(value);

  return {
    [field]: {
      // Allow accidental leading/trailing whitespace in persisted values.
      $regex: `^\\s*${escapedValue}\\s*$`,
      $options: "i",
    },
  };
}

function buildBusinessQuery({
  industry = "",
  region = "",
  city = "",
  search = "",
  isAdmin = false,
} = {}) {
  const filters = [];

  if (!isAdmin) {
    filters.push({ verificationStatus: "verified" });
  }

  if (industry) {
    filters.push({
      $or: [
        exactCaseInsensitive("industry", industry),
        exactCaseInsensitive("industryCategory", industry),
      ],
    });
  }

  if (region) {
    filters.push({
      $or: [
        exactCaseInsensitive("region", region),
        exactCaseInsensitive("city", region),
      ],
    });
  }

  if (city) {
    filters.push(exactCaseInsensitive("city", city));
  }

  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: "i" };
    filters.push({
      $or: [
        { name: pattern },
        { description: pattern },
        { industry: pattern },
        { industryCategory: pattern },
        { region: pattern },
        { city: pattern },
        { tags: pattern },
      ],
    });
  }

  if (filters.length === 0) {
    return {};
  }

  if (filters.length === 1) {
    return filters[0];
  }

  return { $and: filters };
}

function uniqueSorted(values = []) {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeString(value))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
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
    industryCategory: industry || undefined,
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
    foundedYear: normalizeNumber(body.foundedYear),
    stage: normalizeString(body.stage) || undefined,
    fundingRaised: normalizeString(body.fundingRaised) || undefined,
    revenueRange: normalizeString(body.revenueRange) || undefined,
    customerCount: normalizeNumber(body.customerCount),
    logoUrl: normalizeString(body.logoUrl) || undefined,
    socialLinks:
      body.socialLinks && typeof body.socialLinks === "object"
        ? {
            linkedin: normalizeString(body.socialLinks.linkedin) || undefined,
            twitter: normalizeString(body.socialLinks.twitter) || undefined,
            github: normalizeString(body.socialLinks.github) || undefined,
          }
        : undefined,
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
    const withMeta =
      normalizeString(req.query?.withMeta).toLowerCase() === "true" ||
      normalizeString(req.query?.withMeta) === "1";
    const requestedLimit = Number(rawLimit);
    const requestedPage = Number(rawPage);
    const limitForLegacy =
      rawLimit.toLowerCase() === "all"
        ? null
        : Number.isFinite(requestedLimit) && requestedLimit > 0
          ? Math.min(requestedLimit, 200)
          : 100;
    const limitForMeta =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 200)
        : 50;
    const page =
      Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const isAdmin = req.user?.role === "admin";
    const query = buildBusinessQuery({
      industry,
      region,
      city,
      search,
      isAdmin,
    });
    const sort = { createdAt: -1, _id: -1 };
    const businessCollection = Business.collection;

    if (withMeta) {
      const docs = await businessCollection
        .find(query)
        .sort(sort)
        .skip((page - 1) * limitForMeta)
        .limit(limitForMeta + 1)
        .toArray();

      const hasMore = docs.length > limitForMeta;
      const items = hasMore ? docs.slice(0, limitForMeta) : docs;

      return res.json({
        items,
        pagination: {
          page,
          limit: limitForMeta,
          hasMore,
          nextPage: hasMore ? page + 1 : null,
        },
      });
    }

    const businessQuery = businessCollection.find(query).sort(sort);

    if (limitForLegacy !== null) {
      businessQuery.skip((page - 1) * limitForLegacy).limit(limitForLegacy);
    }

    const businesses = await businessQuery.toArray();

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

    const isAdmin = req.user?.role === "admin";
    if (!isAdmin && business.verificationStatus !== "verified") {
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
    const { name, industry, city } = payload;

    if (!name || !industry || !city) {
      return res.status(400).json({
        message: "name, industry, and city are required.",
      });
    }

    const isAdmin = req.user.role === "admin";
    const business = await Business.create({
      ...payload,
      createdBy: req.user.id,
      verificationStatus: isAdmin
        ? payload.verificationStatus || "verified"
        : "pending",
    });

    return res.status(201).json(business);
  } catch (error) {
    return handleBusinessWriteError(error, res, "Unable to create business.");
  }
}

async function getFilterOptions(req, res) {
  try {
    const search = normalizeString(req.query?.search);
    const isAdmin = req.user?.role === "admin";
    const query = buildBusinessQuery({ search, isAdmin });
    const businessCollection = Business.collection;

    const [industries, legacyIndustries, regions, cities] = await Promise.all([
      businessCollection.distinct("industry", query).catch(() => []),
      businessCollection.distinct("industryCategory", query).catch(() => []),
      businessCollection.distinct("region", query).catch(() => []),
      businessCollection.distinct("city", query).catch(() => []),
    ]);

    return res.json({
      industries: uniqueSorted([...industries, ...legacyIndustries]),
      regions: uniqueSorted([...regions, ...cities]),
    });
  } catch (error) {
    console.error("Get business filter options failed:", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch business filter options." });
  }
}

async function update(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid business id." });
    }

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const payload = normalizeBusinessPayload(req.body);

    // Only update fields that are provided
    const allowedFields = [
      "name", "industry", "industryCategory", "region", "city",
      "address", "postalCode", "description", "employees", "tags",
      "contact", "coordinates", "foundedYear", "stage", "fundingRaised",
      "revenueRange", "customerCount", "logoUrl", "socialLinks",
    ];

    for (const field of allowedFields) {
      if (payload[field] !== undefined) {
        business[field] = payload[field];
      }
    }

    await business.save();

    await AdminAction.create({
      action: "edited",
      businessName: business.name,
      businessIndustry: business.industry,
      businessCity: business.city,
      businessRegion: business.region,
      performedBy: req.user.id,
    });

    return res.json(business);
  } catch (error) {
    return handleBusinessWriteError(error, res, "Unable to update business.");
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
  getFilterOptions,
  getById,
  create,
  update,
  remove,
};
