import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
} from "./service";
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

    it("should delete a user by id", async () => {
      let deletedUser = await deleteUserById(newUserId);

      expect(deletedUser?.firstName).toBe("Jordy");
      expect(deletedUser?.lastName).toBe("Yeoman");
    });
  });
});

describe("/api/v1/users/", () => {
  let userSession = {
    id: "",
    email: "",
    access: "",
    refresh: "",
  };

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
    userSession.id = body.id;
  });

  it("/verify/:id/:verificationcode should verify a user", async () => {
    let foundUser = await findUserById(userSession.id);
    const response = await supertest(app)
      .get(
        `/api/v1/users/verify/${userSession.id}/${foundUser?.verificationCode}`
      )
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
  });

  it("auth/session should login a user successfully", async () => {
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

  it("/update - should update user correctly", async () => {
    const { text, statusCode } = await supertest(app)
      .put("/api/v1/users/update")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userSession.access}`)
      .send({
        email: "test123@gmail.com",
        firstName: "Tony",
      })
      .expect(200);

    expect(statusCode).toBe(200);
    expect(text).toEqual("User updated successfully");
    // Assign local variable to newly reset password for testing below
    userSession.email = "test123@gmail.com";
  });

  it("/forgotpassword - should reset password for user", async () => {
    const { text, statusCode } = await supertest(app)
      .post("/api/v1/users/forgotpassword")
      .set("Accept", "application/json")
      .send({
        email: "test123@gmail.com",
      })
      .expect(200);

    expect(statusCode).toBe(200);
    expect(text).toEqual(
      "If a user with that email is registered you will receive a password reset email"
    );
  });

  it("/resetpassword/:id/:passwordResetCode - should successfully update user password", async () => {
    // Local mongoDB instance user for testing
    let foundUser = await findUserById(userSession.id);
    const { statusCode, text } = await supertest(app)
      .post(
        `/api/v1/users/resetpassword/${userSession.id}/${foundUser?.passwordResetCode}`
      )
      .set("Accept", "application/json")
      .send({
        password: "just_send_it113!!44",
        passwordConfirmation: "just_send_it113!!44",
      });

    expect(statusCode).toBe(200);
    expect(text).toEqual("User password updated successfully");
  });

  it("should fail gracefully with incorrect user bearer", async () => {
    const { statusCode } = await supertest(app)
      .delete("/api/v1/users/delete")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer xa15214`);

    expect(statusCode).toBe(403);
  });

  it("should delete a user successfully", async () => {
    const { statusCode } = await supertest(app)
      .delete("/api/v1/users/delete")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userSession.access}`);

    expect(statusCode).toBe(204);
  });
});
