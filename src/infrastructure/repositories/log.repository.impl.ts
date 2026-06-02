import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repository/log.respository";

export class LogRepositoryImpl implements LogRepository {
  // DI of data sources would go here, e.g. constructor(private logDataSource: LogDataSource) {}

  constructor(private readonly logDataSource: LogDataSource) {} //In case my data source changes, I only need to change it here and not in the entire codebase

  async saveLog(log: LogEntity): Promise<void> {
    return this.logDataSource.saveLog(log);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.logDataSource.getLogs(severityLevel);
  }
}
