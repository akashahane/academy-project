const mongoose = require("mongoose");
const initData = require("./data");
const Course = require("../models/course");

const DB_URL = "mongodb://127.0.0.1:27017/academy";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

const initDB = async () => {
  await Course.deleteMany({});
  await Course.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
