enum LogSeverityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public createdAt: Date;
}
