import mongoose from "mongoose";
import app from "./app";

afterAll(async () => {
  //   server.close(); // Need to extract the server instance from app.listen to successfully close after unit tests have run
  await mongoose.disconnect();
  await mongoose.connection.close(); // Closing the DB connection allows Jest to exit successfully.
  //   log.removeAllListeners();
});
