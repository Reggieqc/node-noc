import { envs } from "./envs.plugin";

describe("envs.plugin.ts", () => {
  it("should return env options", () => {
    expect(envs).toEqual({
      PORT: 3000,
      MAILER_SERVICE: "gmail",
      MAILER_EMAIL: "regg.qc94@gmail.com",
      MAILER_SECRET_KEY: "1231231",
      PROD: false,
      MONGO_URL: "mongodb://Reggie:123456789@localhost:27017/",
      MONGO_DB_NAME: "node-noc-test",
      MONGO_USER: "Reggie",
      MONGO_PASSWORD: "123456789",
      POSTGRES_URL: "postgresql://Reggie:123456789@localhost:5432/NOC",
    });
  });

  it("should return error if not found env", async () => {
    jest.resetModules();
    process.env.PORT = "ABC";
    try {
      await import("./envs.plugin");
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  });
});
