import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod = null;

export const connectDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  await mongod.stop();
};

export const cleanData = async () => {
  await mongoose.connection.dropDatabase();
};
