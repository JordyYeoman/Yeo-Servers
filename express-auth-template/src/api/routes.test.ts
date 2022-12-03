import mongoose from "mongoose";
import request from "supertest";
import app, { server } from "../app";

afterAll((done) => {
  server.close(); // Need to extract the server instance from app.listen to successfully close after unit tests have run
  mongoose.disconnect(); // Close connection to mongodb after successful completing all tests
  done();
});

describe("GET /api/v1", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "API - 👋🌎🌍🌏",
        },
        // eslint-disable-next-line @typescript-eslint/comma-dangle
        done
      );
  });
});

describe("GET /api/v1/healthcheck", () => {
  it("responds with a successful 200 status code", (done) => {
    request(app)
      .get("/api/v1/healthcheck")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "All good here!",
        },
        done
      );
  });
});
