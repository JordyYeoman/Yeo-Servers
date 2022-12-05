import config from "config";
import mongoose, { mongo } from "mongoose";
import log from "./logger";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    log.info("Connected to MongoDB");
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}

export function disconnectFromDb() {
  return mongoose.connection.close();
}
