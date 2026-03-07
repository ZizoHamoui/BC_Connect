const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
    const { username, email, password } = req.body;

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
      email,
      password,
    });

    const token = signAuthToken(user);

    return res.status(201).json({
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error("Register failed:", error);
    return res.status(500).json({ message: "Unable to register user." });
  }
}

async function login(req, res) {
  try {
    const { identifier, username, email, password } = req.body;
    const loginIdentifier = identifier || username || email;

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
