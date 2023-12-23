// const request = require("supertest");
// const mongoose = require("mongoose");
// const { app, server } = require("../app");
// const User = require("../models/user");
// const Group = require("../models/group");

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

// describe("POST /api/groups", () => {
//   test("should add groupId to user document and add userId to group document ", async () => {
//     const user = await User.create({
//       name: "name",
//       username: "Username",
//       password: "Password123!",
//     });
//     const userId = user._id;

//     const response = await request(app).post("/api/groups").send({
//       name: "Group 1",
//       userId: userId,
//     });

//     const groupId = response.body.newGroup.id;

//     const updatedUser = await User.findById(userId);
//     const group = await Group.findById(groupId);

//     expect(updatedUser.groups.includes(groupId)).toBe(true);
//     expect(group.users.includes(userId)).toBe(true);
//   });
//   test("should return newGroup as json response", async () => {
//     const user = await User.create({
//       name: "name",
//       username: "Username",
//       password: "Password123!",
//     });
//     const userId = user._id;

//     const response = await request(app).post("/api/groups").send({
//       name: "Group 1",
//       userId: userId,
//     });

//     const newGroup = {
//       id: response.body.newGroup.id,
//       name: "Group 1",
//     };

//     expect(response.status).toBe(201);

//     expect(response.body).toEqual({
//       success: true,
//       newGroup: newGroup,
//     });
//   });
//   test("should return an error when userId is not found", async () => {
//     const userId = new mongoose.Types.ObjectId();

//     const response = await request(app).post("/api/groups").send({
//       name: "Group 1",
//       userId: userId,
//     });

//     expect(response.status).toBe(404);
//     expect(response.body.error).toEqual("User not found");
//   });
//   test("should return a 503 status code", async () => {
//     try {
//       const userId = new mongoose.Types.ObjectId();
//       await request(app).post("/api/groups").send({
//         name: "Group 1",
//         userId: userId,
//       });
//     } catch (error) {
//       expect(error.response.status).toBe(503);
//     }
//   });
// });
