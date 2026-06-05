import { MongoDatabase } from "./init";
import mongoose from "mongoose";

describe("init MongoDB", () => {
  afterAll(() => {
    mongoose.connection.close();
  });
  // console.log(process.env);
  it("should connect to MongoDB", async () => {
    const connected = await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoURL: process.env.MONGO_URL!,
    });
    expect(connected).toBe;
  });

  it("should throw an error", async () => {
    try {
      const connected = await MongoDatabase.connect({
        dbName: process.env.MONGO_DB_NAME!,
        mongoURL: "mongodb://ReggieQ:123456789",
      });
      expect(true).toBe(false);
    } catch (error) {}
  });
});
