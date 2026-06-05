import mongoose from "mongoose";
interface ConnectionOptions {
  mongoURL: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    const { mongoURL, dbName } = options;
    try {
      await mongoose.connect(mongoURL, {
        dbName,
      });
      // console.log("Connected to MongoDB successfully.");
      return true;
    } catch (error) {
      throw error;
    }
  }
}
