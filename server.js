const express = require("express");
const dotenv = require("dotenv");
const morgon = require("morgan");
const connectDB = require("./config/db");

// Load Environemnt Variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route Files
const bootcamps = require("./routes/bootcamps");

const app = express();

// dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgon("dev"));
}

const PORT = process.env.PORT || 3000;

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
