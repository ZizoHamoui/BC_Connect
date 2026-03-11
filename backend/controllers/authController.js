const jwt = require("jsonwebtoken");
const User = require("../models/User");

function normalizeUsername(username) {
  return typeof username === "string" ? username.trim() : "";
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function handleUserWriteError(error, res, fallbackMessage) {
  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    return res
      .status(409)
      .json({ message: `${duplicateField} is already in use.` });
  }

  if (error?.name === "ValidationError") {
    const message =
      Object.values(error.errors || {})[0]?.message || fallbackMessage;
    return res.status(400).json({ message });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({ message: fallbackMessage });
}

function signAuthToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

async function register(req, res) {
  try {
    const username = normalizeUsername(req.body?.username);
    const email = normalizeEmail(req.body?.email);
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required." });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, ...(email ? [{ email: email.toLowerCase() }] : [])],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({
      username,
      email: email || undefined,
      password,
    });

    const token = signAuthToken(user);

    return res.status(201).json({
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    return handleUserWriteError(error, res, "Unable to register user.");
  }
}

async function login(req, res) {
  try {
    const { identifier, username, email, password } = req.body;
    const loginIdentifier = normalizeUsername(identifier || username || email);

    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "identifier and password are required." });
    }

    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { email: String(loginIdentifier).toLowerCase() },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signAuthToken(user);

    return res.json({
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Unable to login." });
  }
}

module.exports = {
  register,
  login,
};
