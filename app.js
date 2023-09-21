const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const passportConfig = require("./passport-config");
const cors = require("cors"); // Import the cors middleware

const db = require("./db");

dotenv.config();

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database: ' + err.message);
//     process.exit(1);
//   }
//   console.log('Connected to MySQL database');
// });

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Enable credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
