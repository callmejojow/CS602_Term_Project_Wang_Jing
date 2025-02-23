const passport = require('passport');

// Middleware to check if user is logged in
const isAuthenticated = passport.authenticate('jwt', { session: false });

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  console.log("Authenticated User:", req.user); // ✅ Debug log

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. You must be logged in." });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Unauthorized. Admins only." });
  }

  next();
};
module.exports = { isAuthenticated, isAdmin };
