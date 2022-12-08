import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { findUserById } from "../user/service";
import supertest from "supertest";

let user = {
  firstName: "Jordy",
  lastName: "Yeoman",
  email: "test3@yeomanindustries.com.au",
  password: "testing_password_123",
  passwordConfirmation: "testing_password_123",
};

describe("Auth Model", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  describe("POST /api/v1/users/", () => {
    let userSession = {
      id: "",
      access: "",
      refresh: "",
    };

    // Setup for user session auth testing
    it("should create a user successfully", async () => {
      const { body, statusCode } = await supertest(app)
        .post("/api/v1/users/")
        .set("Accept", "application/json")
        .send({ ...user, email: "test4@yeomanindustries.com.au" });

      expect(statusCode).toBe(200);
      expect(body.id).toBeDefined();
      userSession.id = body.id;
    });

    it("should verify a user", async () => {
      let foundUser = await findUserById(userSession.id);
      const response = await supertest(app)
        .get(
          `/api/v1/users/verify/${userSession.id}/${foundUser?.verificationCode}`
        )
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
    });

    it("should login a user successfully", async () => {
      const { body, statusCode } = await supertest(app)
        .post("/api/v1/auth/session")
        .set("Accept", "application/json")
        .send({
          email: "test4@yeomanindustries.com.au",
          password: user.password,
        });
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      userSession.access = body.accessToken;
      userSession.refresh = body.refreshToken;
      expect(statusCode).toBe(200);
    });

    it("should reject an invalid user accessToken", async () => {
      const { statusCode } = await supertest(app)
        .post("/api/v1/auth/session/refresh")
        .set("Accept", "application/json")
        .set("x-refresh", userSession.access);

      expect(statusCode).toBe(401);
    });

    it("should refresh a valid user accessToken successfully", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/session/refresh")
        .set("Accept", "application/json")
        .set("x-refresh", userSession.refresh);

      expect(body.accessToken).toBeDefined();
      expect(statusCode).toBe(200);
    });
  });
});
