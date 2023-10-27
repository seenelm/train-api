import request from "supertest";
import { app, server } from "../../src/app";
import UserModel from "../../src/models/userModel";
// import UserDAO from "../../src/datastore/UserDAO";
// import { InternalServerError } from "../../src/utils/errors";

const { connectDB, disconnectDB, cleanData } = require("../../src/database");

describe("AuthController", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await cleanData();
  });

  afterAll(async () => {
    await disconnectDB();
    server.close();
  });

  describe("register", () => {
    it("should register user and send username, userId and token back to user", async () => {
      // arrange
      const user = {
        name: "name",
        username: "username",
        password: "Password123!",
      };
      const response = await request(app).post("/api/register").send(user);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        username: "username",
        userId: expect.any(String),
        token: expect.any(String),
      });
    });
    it("should throw a Conflict Error when username already exists", async () => {
      // arrange
      const existingUser = await UserModel.create({
        name: "name",
        username: "username",
        password: "Password123!",
      });

      // act
      const response = await request(app)
        .post("/api/register")
        .send({ name: "name", username: "username", password: "Password123!" });

      console.log("Response: ", response.body);

      // assert
      expect(response.status).toBe(409);
      expect(response.body.username).toBe("username already taken");
    });
  });
  // describe("login", () => {
  //   it("should login user", async () => {
  //     const response = await request(app).post("/api/login").send({
  //       username: "username",
  //       password: "Password123!",
  //     });

  //     expect(response.body).toEqual({
  //       userId: expect.any(String),
  //       token: expect.any(String),
  //       username: "username",
  //     });
  //   });
  // });
});
