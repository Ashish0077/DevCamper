const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
  path: "./config/config.env"
});

const Bootcamp = require("./models/Bootcamp");

// connect to our db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// import into db
async function importData() {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Improted...".green.inverse);
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

// delete data
async function deleteData() {
  try {
    await Bootcamp.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

if (process.argv[2] == "-import") {
  importData();
} else if (process.argv[2] == "-destroy") {
  deleteData();
} else {
  console.log("Please provide proper argument");
  console.log("-import    :   import data to db from _data");
  console.log("-destroy   :   delete all data from the db");
  process.exit(1);
}
