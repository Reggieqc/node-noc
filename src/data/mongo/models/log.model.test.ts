import mongoose from "mongoose";
import { envs } from "../../../config/plugins/envs.plugin";
import { MongoDatabase } from "../init";
import { LogModel } from "./log.model";

describe("Log model", () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoURL: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it("should return logModel", async () => {
    const logData = {
      origin: "log.model.test.ts",
      message: "test-message",
      level: "low" as const,
    };

    const log = await LogModel.create(logData);
    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        id: expect.any(String),
        createdAt: expect.any(Date),
      }),
    );
    await LogModel.findByIdAndDelete(log.id);
  });

  it("should return the schema object", () => {
    const schema = LogModel.schema.obj;

    expect(schema).toEqual(
      expect.objectContaining({
        level: expect.objectContaining({
          type: expect.any(Function),
          enum: ["low", "medium", "high"],
          default: "low",
          required: true,
        }),
        message: expect.objectContaining({
          type: expect.any(Function),
          required: true,
        }),
        origin: expect.objectContaining({ type: expect.any(Function) }),
        createdAt: expect.objectContaining({
          type: expect.any(Function),
          default: expect.any(Function),
        }),
      }),
    );
  });
});
