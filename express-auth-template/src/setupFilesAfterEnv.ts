import mongoose from "mongoose";
import app from "./app";

afterAll((done) => {
  //   server.close(); // Need to extract the server instance from app.listen to successfully close after unit tests have run
  mongoose.connection.close(); // Closing the DB connection allows Jest to exit successfully.
  //   log.removeAllListeners();
  done();
});
