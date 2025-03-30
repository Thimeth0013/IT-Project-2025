const jwt = require("jsonwebtoken");
const Authentication = require("../models/Authentication"); // Import the Authentication model
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
      // Verify token and remove "Bearer " prefix
      const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
      req.user = decoded; // Set decoded token payload (id, role)

      // Fetch user details from the database
      const user = await Authentication.findById(decoded.id).select("email role");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Set additional user properties for route logic
      req.userId = decoded.id;
      req.userEmail = user.email;
      req.userRole = user.role;

      // Role-based access control
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied. Unauthorized role." });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;