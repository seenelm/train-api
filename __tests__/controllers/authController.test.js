const request = require("supertest");
import { app, server } from "../../app";
import User from "../../src/models/user";
import UserDAO from "../../src/datastore/UserDAO";
import { InternalServerError } from "../../src/utils/errors";

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
    test("should register user and send username, userId and token back to user", async () => {
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
    test("should throw a Conflict Error when username already exists", async () => {
      // arrange
      const existingUser = await User.create({
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
    // test("should throw an InternalServerError when database is unable to create user", async () => {
    //   // arrange
    //   const user = {
    //     name: "name",
    //     username: "username",
    //     password: "Password123!",
    //   };

    //   const userDAO = new UserDAO(User);

    //   jest
    //     .spyOn(userDAO, "createUser")
    //     .mockRejectedValue(new InternalServerError("Creating User Failed"));

    //   // act
    //   const response = await request(app).post("/api/register").send(user);

    //   // assert
    //   expect(response.status).toBe(500);
    // });
  });
});
