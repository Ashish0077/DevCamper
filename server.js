const express = require("express");
const dotenv = require("dotenv");

// Route Files
const bootcamps = require("./routes/bootcamps");

// Load Environemnt Variables
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
