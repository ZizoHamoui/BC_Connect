const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return next();

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Token invalid — continue as unauthenticated
  }

  return next();
}

module.exports = optionalAuth;
