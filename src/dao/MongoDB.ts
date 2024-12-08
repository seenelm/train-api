import mongoose from "mongoose";

class MongoDB {
  private dbUri: any;

  constructor(dbUri: any) {
    this.dbUri = dbUri;
  }

  async startSession(): Promise<mongoose.ClientSession> {
    if (mongoose.connection.readyState) {
      return await mongoose.startSession();
    }
    throw new Error("No active Mongoose Connection.");
  }

  /**
   * Connect to MongoDB database.
   */
  async connect(): Promise<void> {
    await mongoose.connect(this.dbUri).catch((error) => {
      console.error("Error on initial connection: ", error);
    });
    const db = mongoose.connection;
    db.on("error", err => {
      console.log("Error connecting to Database: ", err);
      // process.exit();
    });
    db.once("open", () => {
      console.log("Database connected");
    });
  }

  // Close connection to MongoDB database.
  async close(): Promise<void> {
    await mongoose.connection.close().catch((error) => {
      console.error(error);
    });
  }
}

export default MongoDB;
