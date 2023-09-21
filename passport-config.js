const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    if (results.length === 0) {
      return done(null, false);
    }
    const user = results[0];
    return done(null, user);
  });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.length === 0) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const user = results[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (!isMatch) {
              return done(null, false, {
                message: "Invalid email or password",
              });
            }
            return done(null, user);
          });
        }
      );
    }
  )
);

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      // Check if the email is already registered
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.length > 0) {
            return done(null, false, {
              message: "Email is already registered",
            });
          }

          // If the email is not registered, proceed with registration
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              return done(err);
            }

            // Insert the new user into the database
            const newUser = {
              email: email,
              password: hashedPassword,
              first_name: req.body.firstName, // Include firstName from req.body
              last_name: req.body.lastName,
              mobile: req.body.mobile,
            };

            db.query("INSERT INTO users SET ?", newUser, (err, results) => {
              if (err) {
                return done(err);
              }

              // Set the user's ID to the newly created user's ID
              newUser.id = results.insertId;

              return done(null, newUser);
            });
          });
        }
      );
    }
  )
);
