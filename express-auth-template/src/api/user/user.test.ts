import request from "supertest";
import app from "../../app";

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
        .expect(422)
        .then((response) => {
          expect(response.body).toHaveProperty("message");
          expect(response.body.message).toContain("First name is required");
          expect(response.body.message).toContain("Last name is required");
        }));
    it("creates a new user", async () =>
      request(app)
        .post("/api/v1/users/")
        .set("Accept", "application/json")
        .send({
          firstName: "Jordy",
          lastName: "Yeoman",
          email: "test@yeomanindustries.com.au",
          password: "testing_password_123",
          passwordConfirmation: "testing_password_123",
        })
        .expect("Content-Type", /json/)
        .expect(200));
    // .then((response) => {
    //   expect(response.body).toHaveProperty("message");
    //   expect(response.body.message).toContain("First name is required");
    //   expect(response.body.message).toContain("Last name is required");
    // }));
  });
});
