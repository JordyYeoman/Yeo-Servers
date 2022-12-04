import mongoose from "mongoose";
import request from "supertest";
import app, { server } from "../../app";

afterAll((done) => {
  server.close(); // Need to extract the server instance from app.listen to successfully close after unit tests have run
  mongoose.connection.close(); // Closing the DB connection allows Jest to exit successfully.
  done();
});

describe("USER ROUTE", () => {
  describe("POST /api/v1/users/", () => {
    it("responds with an error if the user is invalid", async () =>
      request(app)
        .post("/api/v1/users/")
        .set("Accept", "application/json")
        .send({
          name: "Jordy Yeoman",
        })
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          console.log("response", response);
          expect(response.body).toHaveProperty("message");
          expect(response.body.message).toContain("Invalid email"); // Expect ZOD error for invalid email.
        }));
  });
});
