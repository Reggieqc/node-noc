import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.respository";

interface CheckServiceMultipleUseCase {
  execute(urls: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback,
  ) {}

  private callLogs(log: LogEntity) {
    this.logRepository.forEach((logRepository) => {
      logRepository.saveLog(log);
    });
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) {
        throw new Error(`Error on check service ${url}`);
      }
      const log = new LogEntity({
        message: `Check successful for ${url}`,
        level: LogSeverityLevel.LOW,
        origin: "check-service.ts",
      });
      this.callLogs(log);
      this.successCallback();
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Check failed for ${url}`,
        level: LogSeverityLevel.HIGH,
        origin: "check-service.ts",
      });
      this.callLogs(log);
      this.errorCallback(`${error}`);
      return false;
    }
  }
}
