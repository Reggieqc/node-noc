import { LogEntity } from "../../entities/log.entity";
import { CheckService } from "./check-service";

describe("CheckService UseCase", () => {
  const successCallback = jest.fn();
  const errorCallback = jest.fn();
  const mockRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const checkService = new CheckService(
    mockRepository,
    successCallback,
    errorCallback,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call successCallback when fetch returns true", async () => {
    const wasOk = await checkService.execute("https://google.com");

    expect(wasOk).toBe(true);
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();

    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });

  it("should call errorCallback when fetch returns false", async () => {
    const wasOk = await checkService.execute("https://googawdawdawdle.com");

    expect(wasOk).toBe(false);
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
  });
});
