import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDataSource } from "../infrastructure/datasources/mongo-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const logRepository = new LogRepositoryImpl(
  new FileSystemDataSource(),
  // new MongoLogDataSource(),
);

const emailService = new EmailService();

export class Server {
  public static start() {
    console.log("Server started...");
    /**                                 *
     *                                  *
     *            SEND EMAIL            *
     *                                  *
     *                                  */
    //Use a use case instead to send email
    // new SendEmailLogs(emailService, logRepository).execute(
    //   "regg.qc94@gmail.com",
    // );
    // emailService.sendEmail({
    //   to: "regg.qc94@gmail.com",
    //   subject: "Test email",
    //   htmlBody: "<h1>This is a test email</h1>",
    // });
    // emailService.sendEmailWithAttachment("regg.qc94@gmail.com");
    /**                                 *
     *                                  *
     *          CRON SERVICE            *
     *                                  *
     *                                  */
    // CronService.createJob("*/5 * * * * *", () => {
    //   const url = "https://google.com";
    //   new CheckService(
    //     logRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error),
    //   ).execute(url);
    //   // new CheckService().execute( 'http://localhost:3000' );
    // });
  }
}
