import { PrismaPg } from "@prisma/adapter-pg";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { PrismaClient, SeverityLevel } from "../../generated/prisma/client";

const severityMap: Record<LogSeverityLevel, SeverityLevel> = {
  [LogSeverityLevel.LOW]: SeverityLevel.LOW,
  [LogSeverityLevel.MEDIUM]: SeverityLevel.MEDIUM,
  [LogSeverityLevel.HIGH]: SeverityLevel.HIGH,
};

export class PostgresLogDataSource implements LogDataSource {
  private readonly prisma: PrismaClient;

  constructor(private readonly envs: { POSTGRES_URL: string }) {
    const adapter = new PrismaPg(this.envs.POSTGRES_URL);
    this.prisma = new PrismaClient({ adapter });
  }

  async saveLog(log: LogEntity): Promise<void> {
    const level = severityMap[log.level];
    await this.prisma.logModel.create({
      data: {
        ...log,
        level,
      },
    });
    console.log("Log saved to Postgres:", log);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityMap[severityLevel];
    const dbLogs = await this.prisma.logModel.findMany({
      where: { level },
    });

    return dbLogs.map(LogEntity.fromObject);
  }
}
