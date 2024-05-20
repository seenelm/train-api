import request from "supertest";
import { app } from "../../src/app";
import { server } from "../../src/server";
import {UserModel} from "../../src/models/userModel";
import BcryptUtil from "../../src/utils/BcryptUtil";
import UserService from "../../src/services/UserService";
import * as Errors from "../../src/utils/errors";

import { connectDB, disconnectDB, cleanData } from "../../src/database";

jest.mock("../../src/services/UserService");

describe("AuthController", () => {
  
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await cleanData();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await disconnectDB();
    server.close();
  });

  describe("register", () => {
    it("should register user and send username, userId and token back to user", async () => {

      UserService.registerUser = jest.fn().mockResolvedValue({
        username: "username",
        userId: "userId",
        token: "token"
      });
      
      const response = await request(app).post("/api/register").send({
        name: "name",
        username: "username",
        password: "Password123!"
      });

      console.log("Response: ", response);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        username: "username",
        userId: expect.any(String),
        token: expect.any(String),
      });
    });
    it("should throw a Conflict Error when username already exists", async () => {

      UserService.registerUser = jest.fn().mockImplementation(() => {
        let errors = { username: "username already taken" };
        throw new Errors.ConflictError("Conflict Error", errors);
      });

      // act
      const response = await request(app)
        .post("/api/register")
        .send({ name: "name", username: "username", password: "Password123!" });

      // assert
      expect(response.status).toBe(409);
      expect(response.body.username).toBe("username already taken");
    });
    describe("when credentials have invalid data", () => {
      it("should return 400 status code when username is missing", async () => {
        const user = {
          name: "name",
          username: "",
          password: "Password123!",
        };
        const response = await request(app).post("/api/register").send(user);
        expect(response.status).toBe(400);
        expect(response.body.errors.username).toBe("Username is required");
      });
      it("should return 400 status code when password is missing", async () => {
        const response = await request(app)
          .post("/api/register")
          .send({ name: "name", username: "username", password: "" });
        expect(response.status).toBe(400);
        expect(response.body.errors.password).toBe("Password is required");
      });
      it("should return 400 status code when name is missing", async () => {
        const response = await request(app)
          .post("/api/register")
          .send({ name: "", username: "username", password: "Password123!" });
        expect(response.status).toBe(400);
        expect(response.body.errors.name).toBe("Name is required");
      });
      it("should return 400 status code when name exceeds 35 characters", async () => {
        const response = await request(app).post("/api/register").send({
          name: "Longestnameinthehistoryofnamesintheworld",
          username: "username",
          password: "Password123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.name).toBe(
          "Name should not exceed 35 characters"
        );
      });
      it("should return error response for invalid username, username should be at least 6 characters", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "Abc",
          password: "Password123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.username).toBe(
          "Username should be at least 6 characters"
        );
      });
      it("should return error response for invalid username, username should not exceed 10 characters", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "Longpassword123",
          password: "Password123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.username).toBe(
          "Username should not exceed 10 characters"
        );
      });
      it("should return error response for invalid password, password must contain at least one special character", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "username",
          password: "Password123",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.password).toBe(
          "Password must be a mix of upper & lower case letters, numbers & symbols"
        );
      });
      it("should return error response for invalid password, password must contain at least one digit", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "username",
          password: "Password!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.password).toBe(
          "Password must be a mix of upper & lower case letters, numbers & symbols"
        );
      });
      it("should return error response for invalid password, password must contain at least one uppercase letter", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "username",
          password: "password123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.password).toBe(
          "Password must be a mix of upper & lower case letters, numbers & symbols"
        );
      });
      it("should return error response for invalid password, password must contain at least one lowercase letter", async () => {
        const response = await request(app).post("/api/register").send({
          name: "name",
          username: "username",
          password: "PASSWORD123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.errors.password).toBe(
          "Password must be a mix of upper & lower case letters, numbers & symbols"
        );
      });
    });
  });

  describe("login", () => {
    it("should login user", async () => {

      UserService.loginUser = jest.fn().mockResolvedValue({
        userId: "userId",
        token: "token",
        username: "username"
      })

      const response = await request(app).post("/api/login").send({
        username: "username",
        password: "Password123!"
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        userId: "userId",
        token: "token",
        username: "username",
      });
    });
    describe("when credentials are invalid", () => {
      it("when username and password is missing", async () => {
        const response = await request(app)
          .post("/api/register")
          .send({ username: "", password: "" });
        expect(response.status).toBe(400);
        expect(response.body.errors.username).toBe("Username is required");
        expect(response.body.errors.password).toBe("Password is required");
      });
      it("when username is incorrect", async () => {
        UserService.loginUser = jest.fn().mockImplementation(() => {
          let errors = { message: "Incorrect Username or Password" };
          const error = new Errors.CustomError(errors, 400);
          throw error
        });
  
        const response = await request(app).post("/api/login").send({
          username: "username6",
          password: "Password123!",
        });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
          "Incorrect Username or Password"
        );
      });
      it("when password is incorrect", async () => {
        const hashedPassword = await BcryptUtil.hashPassword("Password123!");
        const existingUser = await UserModel.create({
          name: "name",
          username: "username",
          password: hashedPassword,
        });
        
        UserService.loginUser = jest.fn().mockImplementation(() => {
          let errors = { message: "Incorrect Username or Password" };
          throw new Errors.CustomError(errors, 400);
        });
  
        const response = await request(app).post("/api/login").send({
          username: "username",
          password: "Password12!",
        });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
          "Incorrect Username or Password"
        );
      });
    });
  });
});
