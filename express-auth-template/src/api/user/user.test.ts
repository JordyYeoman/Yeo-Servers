import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createUser, findUserByEmail, findUserById } from "./service";
import supertest from "supertest";
import { User } from "./model";

let user = {
  firstName: "Jordy",
  lastName: "Yeoman",
  email: "test3@yeomanindustries.com.au",
  password: "testing_password_123",
  passwordConfirmation: "testing_password_123",
};

describe("User Model", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  describe("SERVICES", () => {
    let newUserId: string = "";

    it("should find a user by id", async () => {
      let newUser: any = await createUser(user);

      expect(newUser?.email).toBe("test3@yeomanindustries.com.au");
      expect(newUser?.firstName).toBe("Jordy");
      expect(newUser?.lastName).toBe("Yeoman");
      newUserId = newUser?._id;
    });

    it("should find a user by id", async () => {
      let user: User | null = await findUserById(newUserId);

      expect(user?.email).toBe("test3@yeomanindustries.com.au");
      expect(user?.firstName).toBe("Jordy");
      expect(user?.lastName).toBe("Yeoman");
    });

    it("should find a user by email", async () => {
      let user: User | null = await findUserByEmail(
        "test3@yeomanindustries.com.au"
      );

      expect(user?.firstName).toBe("Jordy");
      expect(user?.lastName).toBe("Yeoman");
    });
  });
});

describe("POST /api/v1/users/", () => {
  it("responds with an error if the user is invalid", async () => {
    await request(app)
      .post("/api/v1/users/")
      .set("Accept", "application/json")
      .send({
        name: "Jordy Yeoman",
        email: "jordy.test@yeomanindustries.com.au",
        password: "testing_password!@#$",
      })
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toContain("First name is required");
        expect(response.body.message).toContain("Last name is required");
        expect(response.body.message).toContain(
          "Password Confirmation is required"
        );
      });
  });

  it("should create a user successfully", async () => {
    const { body, statusCode } = await supertest(app)
      .post("/api/v1/users/")
      .set("Accept", "application/json")
      .send({ ...user, email: "test4@yeomanindustries.com.au" });

    expect(statusCode).toBe(200);
    expect(body.id).toBeDefined();
  });
});