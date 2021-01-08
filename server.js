const express = require("express");
const dotenv = require("dotenv");
const morgon = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize")
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit")

// Load Environemnt Variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgon("dev"));
}

// file upload
app.use(fileUpload());

// setting static folder
app.use(express.static(path.join(__dirname, "public")));

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// sanitize data
app.use(mongoSanitize());

// setting security header
app.use(helmet());

// prevent XSS attack
app.use(xssClean());

// rate limiter
const limiter = rateLimit({
  windowMs: 10*60*1000, // 10mins
  max: 100
})

app.use(limiter);

const PORT = process.env.PORT || 3000;

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `App Running at: `.yellow.bold,
    `https://localhost:${PORT}`.underline.bgBlack.white
  );
});
