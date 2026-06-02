import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.respository";

interface SendEmailLogsUseCase {
  execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository,
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    const sent = await this.emailService.sendEmailWithAttachment(to);
    try {
      if (!sent) {
        throw new Error(`Failed to send email to ${to}`);
      }
      const log = new LogEntity({
        message: `Successfully sent email to ${to}`,
        level: LogSeverityLevel.LOW,
        origin: "send-email-logs.ts",
      });
      this.logRepository.saveLog(log);
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Failed to send email to ${to}`,
        level: LogSeverityLevel.HIGH,
        origin: "send-email-logs.ts",
      });
      this.logRepository.saveLog(log);
      return false;
    }
  }
}
