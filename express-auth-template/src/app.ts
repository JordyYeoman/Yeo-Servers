require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./api/routes";
import deserializeUser from "./middlware/deserializeUser";

const app = express();
const port = config.get("port");

app.use(express.json());

app.use(deserializeUser);

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

export const server = app.listen(port, async () => {
  await connectToDb();
  log.info("Systems online and ready sir.");
  log.info(`Server started on PORT: ${port}`);
});

export default app;
