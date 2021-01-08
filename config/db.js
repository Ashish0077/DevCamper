const mongoose = require("mongoose");

async function connectDB() {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(
    `MongoDB Connected : ${connection.connection.host}`.cyan.underline.bold
  );
}

module.exports = connectDB;
