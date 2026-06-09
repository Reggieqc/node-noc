import path from "path";
import fs from "fs";
import { FileSystemDataSource } from "./file-system.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

describe("FileSystemDataSource", () => {
  const logPath = path.join(__dirname, "../../../logs");
  console.log(__dirname);
  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  it("should create log files if they do not exists", () => {
    new FileSystemDataSource();
    const files = fs.readdirSync(logPath);

    expect(files).toContain("logs-low.log");
    expect(files).toContain("logs-medium.log");
    expect(files).toContain("logs-high.log");
  });

  it("should save a log in log-all.log", () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: "Test log",
      level: LogSeverityLevel.LOW,
      origin: "test.ts",
    });

    logDataSource.saveLog(log);

    const lowLogs = fs.readFileSync(`${logPath}/logs-low.log`, "utf-8");

    expect(lowLogs).toContain(JSON.stringify(log));
  });

  it("should save a log in log-medium.log", () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: "Test log",
      level: LogSeverityLevel.MEDIUM,
      origin: "test.ts",
    });

    logDataSource.saveLog(log);

    const mediumLogs = fs.readFileSync(`${logPath}/logs-medium.log`, "utf-8");

    expect(mediumLogs).toContain(JSON.stringify(log));
  });

  it("should save a log in log-high.log", () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: "Test log",
      level: LogSeverityLevel.HIGH,
      origin: "test.ts",
    });

    logDataSource.saveLog(log);

    const highLogs = fs.readFileSync(`${logPath}/logs-high.log`, "utf-8");

    expect(highLogs).toContain(JSON.stringify(log));
  });

  it("should get all logs", async () => {
    const logDataSource = new FileSystemDataSource();

    const logLow = new LogEntity({
      message: "Test log low",
      level: LogSeverityLevel.LOW,
      origin: "test.ts",
    });
    const logMedium = new LogEntity({
      message: "Test log medium",
      level: LogSeverityLevel.MEDIUM,
      origin: "test.ts",
    });
    const logHigh = new LogEntity({
      message: "Test log high",
      level: LogSeverityLevel.HIGH,
      origin: "test.ts",
    });

    await logDataSource.saveLog(logLow);
    await logDataSource.saveLog(logMedium);
    await logDataSource.saveLog(logHigh);

    const logsLow = await logDataSource.getLogs(LogSeverityLevel.LOW);
    const logsMedium = await logDataSource.getLogs(LogSeverityLevel.MEDIUM);
    const logsHigh = await logDataSource.getLogs(LogSeverityLevel.HIGH);

    expect(logsLow).toEqual([logLow]);
    expect(logsMedium).toEqual([logMedium]);
    expect(logsHigh).toEqual([logHigh]);
  });

  it("should not throw an error if path exists", () => {
    new FileSystemDataSource();
    new FileSystemDataSource();

    expect(true).toBeTruthy();
  });

  it("should throw an error if severity level is not defined", async () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: "Test log",
      level: "HIGH_ERROR" as any,
      origin: "test.ts",
    });

    try {
      await logDataSource.getLogs(log.level);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
