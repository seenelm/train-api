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
        username: "tommy98",
        password: "Abcd123!",
      };
      const response = await request(app).post("/signup").send(user);

      expect(response.status).toBe(201);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/signup").send({
        username: "tommy98",
        password: "Abcd123!",
      });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("response has userId", async () => {
      const response = await request(app).post("/signup").send({
        username: "tommy98",
        password: "Abcd123!",
      });
      expect(response.body.userId).toBeDefined();
    });
  });

  describe("when username and password has invalid data", () => {
    test("should return 404 status code when username is missing", async () => {
      const response = await request(app)
        .post("/signup")
        .send({ password: "Password123!" });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Username is required");
    });
    test("should return 404 status code when password is missing", async () => {
      const response = await request(app)
        .post("/signup")
        .send({ username: "username" });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Password is required");
    });
    test("should return error response for invalid username", async () => {
      const response = await request(app).post("/signup").send({
        username: "Abc",
        password: "Password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Username should be at least 6 characters"
      );
    });
    test("should return error response for invalid username", async () => {
      const response = await request(app).post("/signup").send({
        username: "Longpassword123",
        password: "Password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Username should not exceed 10 characters"
      );
    });
    test("should return error response for invalid password, password must contain at least one special character", async () => {
      const response = await request(app).post("/signup").send({
        username: "username",
        password: "Password123",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one digit", async () => {
      const response = await request(app).post("/signup").send({
        username: "username",
        password: "Password!",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one uppercase letter", async () => {
      const response = await request(app).post("/signup").send({
        username: "username",
        password: "password123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
    test("should return error response for invalid password, password must contain at least one lowercase letter", async () => {
      const response = await request(app).post("/signup").send({
        username: "username",
        password: "PASSWORD123!",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be a mix of upper & lower case letters, numbers & symbols"
      );
    });
  });

  describe("when username exists in database", () => {
    test("Given username exists", async () => {
      const existingUser = await User.create({
        username: "Username",
        password: "Password123!",
      });

      await User.create(existingUser);

      const response = await request(app)
        .post("/signup")
        .send({ username: "tommy98" });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("username already taken");
    });
  });

  describe("Add user to database", () => {
    test("should add user", async () => {
      const newUser = {
        username: "tommy98",
        password: "Abcd123!",
      };
      const response = await request(app).post("/signup").send(newUser);

      expect(response.status).toBe(201);

      const user = await User.findOne({ username: newUser.username });
      expect(user).toBeTruthy();
      expect(user.username).toBe(newUser.username);
    });
  });
});
