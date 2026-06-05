import { LogEntity, LogSeverityLevel } from "./log.entity";

describe("LogEntity", () => {
  const dataObj = {
    message: "test-message",
    level: LogSeverityLevel.LOW,
    origin: "log.entity.test.ts",
  };

  it("should create a LogEntity instance", () => {
    const log = new LogEntity(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  it("should create a LogEntity instance from JSON", () => {
    const json = `{"message":"Check successful for https://google.com","level":"low","createdAt":"2026-06-05T15:22:00.127Z","origin":"check-service.ts"}`;

    const log = LogEntity.fromJson(json);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe("Check successful for https://google.com");
    expect(log.level).toBe(LogSeverityLevel.LOW);
    expect(log.origin).toBe("check-service.ts");
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  it("should create a LogEntity instance from object", () => {
    const log = LogEntity.fromObject(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });
});
