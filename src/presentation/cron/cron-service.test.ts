import { CronService } from "./cron-service";

describe("CronService", () => {
  const mockTick = jest.fn();

  it("should create a job", (done) => {
    const job = CronService.createJob("* * * * * *", mockTick);

    setTimeout(() => {
      expect(mockTick).toHaveBeenCalled();
      expect(mockTick).toHaveBeenCalledTimes(3);
      done();
      job.stop();
      // done() is needed because the test is asynchronous.
      // It tells Jest to wait until the setTimeout callback is executed before finishing the test.
    }, 2000);
  });
});
