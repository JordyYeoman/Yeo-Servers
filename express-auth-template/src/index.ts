import app from "./app";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";

// Placing the `app.listen()` inside some other file , other than your file that consists all the routes,
// Jest will not be reading app.listen() at all, since it will only be reading the app file with all routes and middlewares.
//
// This prevents multiple node server instances from spinning up on the same port due to parallelization.

const port = config.get("port");

app.listen(port, async () => {
  await connectToDb();
  log.info("Systems online and ready sir.");
  log.info(`Server started on PORT: ${port}`);
});
