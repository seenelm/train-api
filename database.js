const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod = null;

const connectDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

const cleanData = async () => {
  await mongoose.connection.dropDatabase();
};

module.exports = { connectDB, disconnectDB, cleanData };
