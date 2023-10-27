// const request = require("supertest");
// const mongoose = require("mongoose");
// const { app, server } = require("../app");
// const User = require("../models/user");
// const Group = require("../models/group");
// const bcrypt = require("bcrypt");

// const { connectDB, disconnectDB, cleanData } = require("../database");

// beforeAll(async () => {
//   await connectDB();
// });

// beforeEach(async () => {
//   await cleanData();
// });

// afterAll(async () => {
//   await disconnectDB();
//   server.close();
// });

// describe("POST /signup", () => {
//   describe("when username and password exists", () => {
//     test("should respond with a 201 status code", async () => {
//       const user = {
//         name: "name",
//         username: "username",
//         password: "Password123!",
//       };
//       const response = await request(app).post("/api/signup").send(user);

//       expect(response.status).toBe(201);
//     });
//     test("should specify json in the content type header", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "Password123!",
//       });

//       expect(response.headers["content-type"]).toEqual(
//         expect.stringContaining("json")
//       );
//     });
//     test("response has userId", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "Password123!",
//       });
//       expect(response.body.userId).toBeDefined();
//       expect(response.body.success).toEqual(true);
//     });
//   });

//   describe("when username and password has invalid data", () => {
//     test("should return 400 status code when username is missing", async () => {
//       const user = {
//         name: "name",
//         username: "",
//         password: "Password123!",
//       };
//       const response = await request(app).post("/api/signup").send(user);
//       expect(response.status).toBe(400);
//       expect(response.body.errors.username).toBe("Username is required");
//     });
//     test("should return 400 status code when password is missing", async () => {
//       const response = await request(app)
//         .post("/api/signup")
//         .send({ name: "name", username: "username", password: "" });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe("Password is required");
//     });
//     test("should return 400 status code when name is missing", async () => {
//       const response = await request(app)
//         .post("/api/signup")
//         .send({ name: "", username: "username", password: "Password123!" });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.name).toBe("Name is required");
//     });
//     test("should return 400 status code when name exceeds 35 characters", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "Longestnameinthehistoryofnamesintheworld",
//         username: "username",
//         password: "Password123!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.name).toBe(
//         "Name should not exceed 35 characters"
//       );
//     });
//     test("should return error response for invalid username, username should be at least 6 characters", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "Abc",
//         password: "Password123!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.username).toBe(
//         "Username should be at least 6 characters"
//       );
//     });
//     test("should return error response for invalid username, username should not exceed 10 characters", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "Longpassword123",
//         password: "Password123!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.username).toBe(
//         "Username should not exceed 10 characters"
//       );
//     });
//     test("should return error response for invalid password, password must contain at least one special character", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "Password123",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe(
//         "Password must be a mix of upper & lower case letters, numbers & symbols"
//       );
//     });
//     test("should return error response for invalid password, password must contain at least one digit", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "Password!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe(
//         "Password must be a mix of upper & lower case letters, numbers & symbols"
//       );
//     });
//     test("should return error response for invalid password, password must contain at least one uppercase letter", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "password123!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe(
//         "Password must be a mix of upper & lower case letters, numbers & symbols"
//       );
//     });
//     test("should return error response for invalid password, password must contain at least one lowercase letter", async () => {
//       const response = await request(app).post("/api/signup").send({
//         name: "name",
//         username: "username",
//         password: "PASSWORD123!",
//       });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe(
//         "Password must be a mix of upper & lower case letters, numbers & symbols"
//       );
//     });
//   });

//   describe("when username exists in database", () => {
//     test("Given username exists", async () => {
//       const existingUser = await User.create({
//         name: "name",
//         username: "username",
//         password: "Password123!",
//       });

//       const response = await request(app)
//         .post("/api/signup")
//         .send({ name: "name", username: "username", password: "Password123!" });

//       expect(response.status).toBe(409);
//       expect(response.body.errors.username).toBe("username already taken");
//     });
//   });

//   describe("Add user to database", () => {
//     test("should add user", async () => {
//       const newUser = new User({
//         name: "name",
//         username: "username",
//         password: "Password123!",
//       });

//       const savedUser = await newUser.save();

//       expect(savedUser).toBeDefined();
//     });
//   });
// });

// describe("POST /login", () => {
//   describe("when username and password has valid data", () => {
//     test("when user is verified by database", async () => {
//       const hashedPassword = await bcrypt.hash("Password123!", 12);
//       const existingUser = await User.create({
//         name: "name",
//         username: "username",
//         password: hashedPassword,
//       });

//       const response = await request(app).post("/api/login").send({
//         username: "username",
//         password: "Password123!",
//       });

//       const user = await User.findOne({ username: "username" });
//       expect(user).not.toBeNull();

//       const existingPassword = existingUser.password;
//       const validPassword = await bcrypt.compare(
//         "Password123!",
//         existingPassword
//       );
//       if (validPassword) {
//         expect(response.status).toBe(201);
//         expect(response.body.success).toBe(true);
//       }
//     });
//   });
//   describe("when username and password has invalid data", () => {
//     test("when username and password is missing", async () => {
//       const response = await request(app)
//         .post("/api/login")
//         .send({ username: "", password: "" });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.username).toBe("Username is required");
//       expect(response.body.errors.password).toBe("Password is required");
//     });
//     test("when username is missing", async () => {
//       const response = await request(app)
//         .post("/api/login")
//         .send({ username: "", password: "Password123!" });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.username).toBe("Username is required");
//     });
//     test("when password is missing", async () => {
//       const response = await request(app)
//         .post("/api/login")
//         .send({ username: "username", password: "" });
//       expect(response.status).toBe(400);
//       expect(response.body.errors.password).toBe("Password is required");
//     });
//     test("when username is incorrect", async () => {
//       const hashedPassword = await bcrypt.hash("Password123!", 12);
//       const existingUser = await User.create({
//         name: "name",
//         username: "username",
//         password: hashedPassword,
//       });

//       const response = await request(app).post("/api/login").send({
//         username: "user",
//         password: "Password123!",
//       });

//       const user = await User.findOne({ username: "user" });
//       if (!user) {
//         expect(response.status).toBe(400);
//         expect(response.body.errors.message).toBe(
//           "Incorrect Username or Password"
//         );
//       }
//     });
//     test("when password is incorrect", async () => {
//       const hashedPassword = await bcrypt.hash("Password123!", 12);
//       const existingUser = await User.create({
//         name: "name",
//         username: "username",
//         password: hashedPassword,
//       });

//       const response = await request(app).post("/api/login").send({
//         username: "username",
//         password: "Password",
//       });

//       const existingPassword = existingUser.password;
//       const validPassword = await bcrypt.compare("Password", existingPassword);
//       if (!validPassword) {
//         expect(response.status).toBe(400);
//         expect(response.body.errors.message).toBe(
//           "Incorrect Username or Password"
//         );
//       }
//     });
//   });
// });

// // usersController
// describe("GET /api/:userId", () => {
//   test("should return user groups when user id is found", async () => {
//     const group1 = await Group.create({
//       name: "Group 1",
//     });

//     const group2 = await Group.create({
//       name: "Group 2",
//     });

//     const user = await User.create({
//       name: "name",
//       username: "Username",
//       password: "Password123!",
//       groups: [group1._id, group2._id],
//     });

//     const response = await request(app).get(`/api/${user._id}`);

//     expect(response.status).toBe(201);

//     expect(response.body).toEqual({
//       groups: [
//         { id: group1._id.toJSON(), name: "Group 1" },
//         { id: group2._id.toJSON(), name: "Group 2" },
//       ],
//     });
//   });
//   test("should return an error when userId is not found", async () => {
//     const userId = new mongoose.Types.ObjectId();

//     const response = await request(app).get(`/api/${userId}`);

//     expect(response.status).toBe(404);
//     expect(response.body.error).toEqual("User not found");
//   });
//   test("should return a 503 status code", async () => {
//     try {
//       const userId = new mongoose.Types.ObjectId();
//       await request(app).get(`/api/${userId}`);
//     } catch (error) {
//       expect(error.response.status).toBe(503);
//     }
//   });
// });
