import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.respository";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository, //Doesn't interact with the data source directly, it interacts with the repository, which is the one that interacts with the data source. This way we can change the data source without changing the use case.
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback,
  ) {}

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
      await this.logRepository.saveLog(log);
      this.successCallback();
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Check failed for ${url}`,
        level: LogSeverityLevel.HIGH,
        origin: "check-service.ts",
      });
      await this.logRepository.saveLog(log);
      this.errorCallback(`${error}`);
      return false;
    }
  }
}
