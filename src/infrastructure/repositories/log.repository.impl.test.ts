import { LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepositoryImpl } from "./log.repository.impl";

describe("LogRepositoryImpl", () => {
  const dataSourceMock = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const logRepository = new LogRepositoryImpl(dataSourceMock);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saveLog should call the datasource with args", async () => {
    const log = {
      message: "Test log",
      level: LogSeverityLevel.LOW,
      origin: "test.ts",
      createdAt: new Date(),
    };

    await logRepository.saveLog(log);

    expect(dataSourceMock.saveLog).toHaveBeenCalled();
    expect(dataSourceMock.saveLog).toHaveBeenCalledWith(log);
  });

  it("getLogs should call the datasource with args", async () => {
    const logSeverity = LogSeverityLevel.LOW;

    await logRepository.getLogs(logSeverity);

    expect(dataSourceMock.getLogs).toHaveBeenCalled();
    expect(dataSourceMock.getLogs).toHaveBeenCalledWith(logSeverity);
  });
});
