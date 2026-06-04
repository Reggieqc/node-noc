import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "./config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";
import { PrismaClient } from "./generated/prisma/client";

import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  //MONGO CONNECTION
  await MongoDatabase.connect({
    mongoURL: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  //POSTGRESQL CONNECTION
  // const adapter = new PrismaPg(envs.POSTGRES_URL);
  // const prisma = new PrismaClient({ adapter });

  // const newLog = await prisma.logModel.create({
  //   data: {
  //     level: "HIGH",
  //     message: "This is a high severity log",
  //     origin: "app.ts",
  //   },
  // });
  // const logs = await prisma.logModel.findMany({ where: { level: "HIGH" } });
  // console.log(logs);

  // Create a new collection = that is equal to a table in a  relational database and a  document equal to a row in a relational database
  // const newLog = await LogModel.create({
  //   level: "high",
  //   message: "This is a high severity log",
  //   origin: "app.ts",
  // });

  // await newLog.save();

  //Get collection
  // const logs = await LogModel.find();
  // console.log(logs);

  Server.start();
  // console.log(envs.PORT);
}
