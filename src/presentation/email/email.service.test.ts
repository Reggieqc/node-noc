import { EmailService, SendEmailOptions } from "./email.service";
import nodemailer from "nodemailer";

describe("EmailService", () => {
  const mockSendMail = jest.fn();

  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendMail,
  });
  const emailService = new EmailService();

  it("should send email", async () => {
    const options: SendEmailOptions = {
      to: "regqc@hotmail.com",
      subject: "Test",
      htmlBody: "<h1>Test</h1>",
    };

    await emailService.sendEmail(options);

    expect(mockSendMail).toHaveBeenCalledWith({
      attachments: expect.any(Array),
      from: "regg.qc94@gmail.com",
      html: "<h1>Test</h1>",
      subject: "Test",
      to: "regqc@hotmail.com",
    });
  });

  it("should send email with attachements", async () => {
    await emailService.sendEmailWithAttachment("regqc@hotmail.com");

    expect(mockSendMail).toHaveBeenCalledWith({
      attachments: expect.any(Array),
      from: "regg.qc94@gmail.com",
      html: "<h1>Attached are the server logs</h1>",
      subject: "Server logs",
      to: "regqc@hotmail.com",
    });
  });
});
