const request = require("supertest");
const { app, server } = require("../app");
const User = require("../models/user");

const { connectDB, disconnectDB, cleanData } = require("../database");

describe("POST /signup", () => {
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

  describe("when username and password exists", () => {
    test("should respond with a 201 status code", async () => {
      const user = {
        name: "name",
        username: "username",
        password: "Password123!",
      };
      const response = await request(app).post("/signup").send(user);

      expect(response.status).toBe(201);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "username",
        password: "Password123!",
      });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("response has userId", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "username",
        password: "Password123!",
      });
      expect(response.body.userId).toBeDefined();
      expect(response.body.success).toEqual(true);
    });
  });

  describe("when username and password has invalid data", () => {
    test("should return 400 status code when username is missing", async () => {
      const user = {
        name: "name",
        username: "",
        password: "Password123!",
      };
      const response = await request(app).post("/signup").send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors.username).toBe("Username is required");
    });
    test("should return 400 status code when password is missing", async () => {
      const response = await request(app)
        .post("/signup")
        .send({ name: "name", username: "username", password: "" });
      expect(response.status).toBe(400);
      expect(response.body.errors.password).toBe("Password is required");
    });
    test("should return 400 status code when name is missing", async () => {
      const response = await request(app)
        .post("/signup")
        .send({ name: "", username: "username", password: "Password123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors.name).toBe("Name is required");
    });
    test("should return 400 status code when name exceeds 35 characters", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          name: "Longestnameinthehistoryofnamesintheworld",
          username: "username",
          password: "Password123!",
        });
      expect(response.status).toBe(400);
      expect(response.body.errors.name).toBe(
        "Name should not exceed 35 characters"
      );
    });
    test("should return error response for invalid username, username should be at least 6 characters", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "Abc",
        password: "Password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors.username).toBe(
        "Username should be at least 6 characters"
      );
    });
    test("should return error response for invalid username, username should not exceed 10 characters", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "Longpassword123",
        password: "Password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors.username).toBe(
        "Username should not exceed 10 characters"
      );
    });
    test("should return error response for invalid password, password must contain at least one special character", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "username",
        password: "Password123",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors.password).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one digit", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "username",
        password: "Password!",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors.password).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one uppercase letter", async () => {
      const response = await request(app).post("/signup").send({
        name: "name",
        username: "username",
        password: "password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors.password).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one lowercase letter", async () => {
      const response = await request(app).post("/signup").send({
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

  describe("when username exists in database", () => {
    test("Given username exists", async () => {
      const existingUser = await User.create({
        name: "name",
        username: "username",
        password: "Password123!",
      });

      await User.create(existingUser);

      const response = await request(app)
        .post("/signup")
        .send({ name: "name", username: "username", password: "Password123!" });

      expect(response.status).toBe(409);
      expect(response.body.errors.username).toBe("username already taken");
    });
  });

  describe("Add user to database", () => {
    test("should add user", async () => {
      const newUser = new User({
        name: "name",
        username: "username",
        password: "Password123!",
      });

      const savedUser = await newUser.save();

      expect(savedUser).toBeDefined();
    });
  });
});
