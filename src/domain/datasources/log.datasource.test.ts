import { LogEntity, LogSeverityLevel } from "../entities/log.entity";
import { LogDataSource } from "./log.datasource";

describe("Log Data Source", () => {
  const newLog = new LogEntity({
    origin: "log.datasource.test.ts",
    message: "test-message",
    level: LogSeverityLevel.LOW,
    createdAt: new Date(),
  });
  class MockLogDatasource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
      return;
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [newLog];
    }
  }
  it("should test the abstract class", async () => {
    const mockLogDatasource = new MockLogDatasource();

    expect(mockLogDatasource).toBeInstanceOf(MockLogDatasource);
    expect(mockLogDatasource).toHaveProperty("saveLog");
    expect(mockLogDatasource).toHaveProperty("getLogs");

    await mockLogDatasource.saveLog(newLog);

    const logs = await mockLogDatasource.getLogs(LogSeverityLevel.LOW);

    expect(logs).toEqual([newLog]);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toBeInstanceOf(LogEntity);
  });
});
