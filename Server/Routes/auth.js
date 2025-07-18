const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Initiate login
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

// Google callback
router.get("/google/callback", passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { _id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  }
);

module.exports = router;
