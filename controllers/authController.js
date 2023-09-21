const db = require("../db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const upload = require("../middlewares/multerMiddleware").single(
  "profileImage"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.ensureAuthenticated = (req, res, next) => {
  console.log("Req::", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ error: "Unauthorized" });
};

exports.register = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate("local-register", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: user.email,
        subject: "Registeration Successful",
        //html: `<p>Please click the following link to verify your email:</p><p><a href="${verificationLink}">Click here</a></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Successfully Registered:", info.response);
        }
      });

      return res.status(201).json({ message: "Registration successful" });
    });
  })(req, res, next);
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate("local-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
};

// Profile
exports.profile = (req, res) => {
  // You can access user data from req.user (assuming it's populated by Passport)
  res.json(req.user);
};

// Update user's profile image
exports.updateProfileImage = (req, res) => {
  const { userId } = req.user; // Assuming you have a user ID available in req.user
  const profileImage = req.file ? req.file.filename : null;

  if (!profileImage) {
    return res.status(400).json({ error: "Profile image is required" });
  }

  const query = "UPDATE users SET profile_image = ? WHERE id = ?";

  db.query(query, [profileImage, userId], (err, results) => {
    if (err) {
      console.error("Error updating profile image:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile image updated successfully" });
  });
};
