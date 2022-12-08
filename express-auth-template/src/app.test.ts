import app from "./app";
import request from "supertest";

describe("app", () => {
  it("GET UNKNOWN responds with a not found message", (done) => {
    request(app)
      .get("/what-is-this-even")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
  it("POST UNKNOWN responds with a not found message", (done) => {
    request(app)
      .post("/what-is-this-even")
      .set("Accept", "application/json")
      .send({ email: "testing@example.com" })
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
  it("PUT UNKNOWN responds with a not found message", (done) => {
    request(app)
      .put(`/${123}`)
      .set("Accept", "application/json")
      .send({ email: "testing@example.com" })
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
  it("DELETE UNKNOWN responds with a not found message", (done) => {
    request(app)
      .delete(`/${123}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});
