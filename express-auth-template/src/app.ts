require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";

const app = express();
const port = config.get("port");

app.listen(port, async () => {
  connectToDb();
  log.info("Connected to MongoDB");
  log.info("Systems Online and Ready, sir");
  log.info(`App started at http://localhost:${port}`);
});