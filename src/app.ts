import { envs } from "./config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";

import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoURL: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

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
