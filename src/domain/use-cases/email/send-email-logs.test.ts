import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity } from "../../entities/log.entity";
import { SendEmailLogs } from "./send-email-logs";

describe("Send email logs", () => {
  const mockEmailService = {
    sendEmailWithAttachment: jest.fn().mockReturnValue(true),
  } as any;
  const mockLogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const sendEmailLogs = new SendEmailLogs(mockEmailService, mockLogRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send email logs", async () => {
    const wasSend = await sendEmailLogs.execute("test@hotmail.com");
    expect(wasSend).toBe(true);
    expect(mockEmailService.sendEmailWithAttachment).toHaveBeenCalledWith(
      "test@hotmail.com",
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalled();
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
  });

  it("should log in case of error", async () => {
    mockEmailService.sendEmailWithAttachment.mockReturnValue(false);

    const wasSend = await sendEmailLogs.execute("test@hotmail.com");

    expect(wasSend).toBe(false);
    expect(mockEmailService.sendEmailWithAttachment).toHaveBeenCalledWith(
      "test@hotmail.com",
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalled();
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      message: "Failed to send email to test@hotmail.com",
      level: "high",
      origin: "send-email-logs.ts",
      createdAt: expect.any(Date),
    });
  });
});
