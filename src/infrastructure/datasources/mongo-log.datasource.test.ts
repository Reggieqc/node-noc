import mongoose from "mongoose";
import { envs } from "../../config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "../../data/mongo";
import { MongoLogDataSource } from "./mongo-log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

describe("MongoLogDataSource", () => {
  const logDataSource = new MongoLogDataSource();
  const log = new LogEntity({
    message: "Test log",
    level: LogSeverityLevel.LOW,
    origin: "test.ts",
  });

  beforeAll(async () => {
    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoURL: envs.MONGO_URL,
    });
  });

  afterEach(async () => {
    await LogModel.deleteMany();
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it("should create a log", async () => {
    const logSpy = jest.spyOn(console, "log");

    await logDataSource.saveLog(log);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      "Log saved to MongoDB:",
      expect.any(String),
    );
  });

  it("should get logs", async () => {
    await logDataSource.saveLog(log);
    const logs = await logDataSource.getLogs(LogSeverityLevel.LOW);

    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual(log);
  });
});
