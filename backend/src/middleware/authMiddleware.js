// backend/src/middleware/authMiddleware.js

// Dummy authentication middleware for development.
// Replace this with your real authentication middleware in production.
module.exports = (req, res, next) => {
    req.user = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      nova_tag: "$JohnDoe"  // This should be the sender's NovaTag.
    };
    console.log("Auth Middleware executed. req.user:", req.user);
    next();
  };
  