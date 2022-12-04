import mongoose from "mongoose";
import app, { server } from "./app";
import request from "supertest";
// tetsing
import log from "./utils/logger";

afterAll((done) => {
  server.close(); // Need to extract the server instance from app.listen to successfully close after unit tests have run
  mongoose.connection.close(); // Closing the DB connection allows Jest to exit successfully.
  //   log.removeAllListeners();
  done();
});

describe("app", () => {
  it("responds with a not found message", (done) => {
    request(app)
      .get("/what-is-this-even")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});
