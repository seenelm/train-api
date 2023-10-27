import mongoose from "mongoose";

class MongoDB {
  private dbUri: any;

  constructor(dbUri: any) {
    this.dbUri = dbUri;
  }

  /**
   * Connect to MongoDB database.
   */
  async connect(): Promise<void> {
    await mongoose.connect(this.dbUri).catch((error) => {
      console.error("Error on initial connection: ", error);
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
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
