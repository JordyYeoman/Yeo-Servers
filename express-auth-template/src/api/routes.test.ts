import request from "supertest";
import app from "../app";

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
