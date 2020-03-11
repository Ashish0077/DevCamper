const express = require("express");
const dotenv = require("dotenv");
const morgon = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load Environemnt Variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgon("dev"));
}

// body parser
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`.yellow.bold);
});
