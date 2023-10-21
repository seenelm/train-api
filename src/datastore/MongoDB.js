import mongoose from "mongoose";

class MongoDB {
  constructor(dbUri) {
    this.dbUri = dbUri;
  }

  /**
   * Connect to MongoDB database.
   * @param {*} dbUri uri of database to connect to
   * @param {*} collection
   */
  async connect() {
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
  async close() {
    await mongoose.connection.close().catch((error) => {
      console.error(error);
    });
  }
}

export default MongoDB;
