const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const MONGO_DB = process.env.MONGO_URL;
    mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (err) {
    process.exit(1);
  }
};

module.exports = {
  connectMongo,
};
