import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/envs.plugin";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}
interface Attachment {
  filename: string;
  path: string;
}
export class EmailService {
  constructor() {}

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;
    try {
      const sentInformation = await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
        attachments,
      });
      console.log(sentInformation);
      const log = new LogEntity({
        message: `Email sent successfully to ${to}`,
        level: LogSeverityLevel.LOW,
        origin: "email-service.ts",
      });
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Failed to send email to ${to}`,
        level: LogSeverityLevel.HIGH,
        origin: "email-service.ts",
      });
      return false;
    }
  }

  async sendEmailWithAttachment(to: string | string[]): Promise<boolean> {
    const subject = "Server logs";
    const htmlBody = "<h1>Attached are the server logs</h1>";
    const attachments = [
      {
        filename: "logs-low.log",
        path: "./logs/logs-low.log",
      },
      {
        filename: "logs-medium.log",
        path: "./logs/logs-medium.log",
      },
      {
        filename: "logs-high.log",
        path: "./logs/logs-high.log",
      },
    ];
    return this.sendEmail({ to, subject, htmlBody, attachments });
  }
}
