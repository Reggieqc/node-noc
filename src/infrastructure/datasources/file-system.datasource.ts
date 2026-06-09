import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from "fs";

export class FileSystemDataSource implements LogDataSource {
  private readonly logPath = "./logs";
  private readonly allLogsPath = `${this.logPath}/logs-low.log`;
  private readonly mediumLogsPath = `${this.logPath}/logs-medium.log`;
  private readonly highLogsPath = `${this.logPath}/logs-high.log`;

  constructor() {
    this.createLogFiles();
  }

  private createLogFiles() {
    [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
      (path) => {
        if (!fs.existsSync(this.logPath)) {
          fs.mkdirSync(this.logPath);
        }

        [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
          (path) => {
            if (fs.existsSync(path)) return;

            fs.writeFileSync(path, "");
          },
        );
      },
    );
  }

  getLogsFromFile(path: string): LogEntity[] {
    const content = fs.readFileSync(path, "utf-8");
    const logs = content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map(LogEntity.fromJson);
    return logs;
  }

  async saveLog(log: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(log)}\n`;
    switch (log.level) {
      case LogSeverityLevel.LOW:
        fs.appendFileSync(this.allLogsPath, logAsJson);
        break;
      case LogSeverityLevel.MEDIUM:
        fs.appendFileSync(this.mediumLogsPath, logAsJson);
        break;
      case LogSeverityLevel.HIGH:
        fs.appendFileSync(this.highLogsPath, logAsJson);
        break;
      default:
        throw new Error("Invalid log level");
    }
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.LOW:
        return Promise.resolve(this.getLogsFromFile(this.allLogsPath));
      case LogSeverityLevel.MEDIUM:
        return Promise.resolve(this.getLogsFromFile(this.mediumLogsPath));
      case LogSeverityLevel.HIGH:
        return Promise.resolve(this.getLogsFromFile(this.highLogsPath));
      default:
        throw new Error("Log severity level not supported");
    }
  }
}
