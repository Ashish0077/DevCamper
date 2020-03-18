const express = require("express");
const dotenv = require("dotenv");
const morgon = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

// Load Environemnt Variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

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

const PORT = process.env.PORT || 3000;

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `App Running at: `.yellow.bold,
    `https://localhost:${PORT}`.underline.bgBlack.white
  );
});
