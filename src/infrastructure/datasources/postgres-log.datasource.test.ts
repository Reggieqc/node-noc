import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "../../config/plugins/envs.plugin";
import { PrismaClient } from "@prisma/client/extension";
import { PostgresLogDataSource } from "./postgres-log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

describe("PostgresLogDataSource", () => {
  const data = new PostgresLogDataSource(envs);
  const newLog = {
    message: "Test log",
    level: LogSeverityLevel.LOW,
    origin: "test.ts",
    createdAt: new Date(),
  };

  afterEach(async () => {
    await data.cleanLogs();
  });

  it("should create a log", async () => {
    const logSpy = jest.spyOn(console, "log");

    await data.saveLog(newLog);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      "Log saved to Postgres:",
      expect.any(Object),
    );
  });

  it("should get logs", async () => {
    await data.saveLog(newLog);
    const logs = await data.getLogs(LogSeverityLevel.LOW);

    expect(logs).toHaveLength(1);
    expect(logs[0]).toBeInstanceOf(LogEntity);
  });
});
