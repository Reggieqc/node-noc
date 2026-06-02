import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDataSource(),
);

export class Server {
  public static start() {
    console.log("Server started...");
    //Send email
    // const emailService = new EmailService();
    // emailService.sendEmail({
    //   to: "regg.qc94@gmail.com",
    //   subject: "Test email",
    //   htmlBody: "<h1>This is a test email</h1>",
    // });
    // emailService.sendEmailWithAttachment("regg.qc94@gmail.com");

    //Cron
    // CronService.createJob("*/5 * * * * *", () => {
    //   const url = "http://localhost:3000";
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error),
    //   ).execute(url);
    //   // new CheckService().execute( 'http://localhost:3000' );
    // });
  }
}
