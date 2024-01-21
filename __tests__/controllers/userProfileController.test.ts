import request from "supertest";
import { server } from "../../src/server";
import { app } from "../../src/app";
import JWTUtil from "../../src/utils/JWTUtil";

import { connectDB, disconnectDB, cleanData } from "../../src/database";
import { Types } from "mongoose";
import { UserModel } from "../../src/models/userModel";

import { StatusCodes as HttpStatusCode } from "http-status-codes";
import UserProfileService from "../../src/services/UserProfileService";
import * as Errors from "../../src/utils/errors";
import { UserProfileModel } from "../../src/models/userProfile";
import { ProfileAccess } from "../../src/common/constants";

jest.mock("../../src/models/userModel");
jest.mock("../../src/services/UserProfileService");

describe("User Profile Controller", () => {
    let userProfileService: UserProfileService;

    beforeAll(async () => {
        try {
            await connectDB();
        } catch (error) {
            console.log("Error connecting to database: ", error);
        }
    });

    beforeEach(async () => {
        await cleanData();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await disconnectDB();
        server.close();
    });

    describe("fetchUserGroups", () => {
        it("should return 200 status code if userId is provided", async () => {
            const userId = new Types.ObjectId();

            const user = new UserModel({
                username: "testuser",
                password: "testpassword",
                isActive: true,
            });
            await user.save();

            UserModel.findById = jest.fn().mockResolvedValue(user);

            const payload = { userId: user._id };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .get(`/api/users/${userId}/groups`)
                .set("Authorization", `Bearer ${token}`);

            if (response.status === 500) {
                console.error(response.body);
            }

            expect(response.status).toBe(200);
        });

        it("should return 400 status code if userId is an invalid ObjectId", async () => {
            const userId = "1234";

            const user = new UserModel({
                username: "testuser",
                password: "testpassword",
                isActive: true,
            });
            await user.save();

            UserModel.findById = jest.fn().mockResolvedValue(user);

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .get(`/api/users/${userId}/groups`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body).toEqual({
                userId: ["Invalid userId"],
            });
        });

        it("should return 404 status code if user is not found", async () => {
            const userId = new Types.ObjectId();

            jest.spyOn(
                UserProfileService.prototype,
                "fetchUserGroups",
            ).mockImplementation(() => {
                throw new Errors.ResourceNotFoundError("User not found");
            });

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .get(`/api/users/${userId}/groups`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
            expect(response.body).toEqual("User not found");
        });
    });

    describe("updateUserProfile", () => {
        it("should return a 200 status code", async () => {
            const userId = new Types.ObjectId();

            const user = new UserModel({
                username: "testuser",
                password: "testpassword",
                isActive: true,
            });
            await user.save();

            const userProfile = new UserProfileModel({
                userId: new Types.ObjectId(),
                username: "testuser",
                name: "testname",
            });
            await userProfile.save();

            const updateuserProfileRequest = {
                userId: userId,
                username: "mockUsername",
                name: "mockName",
                userBio: "This is a test",
                accountType: 1,
            };

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .put(`/api/users/${userId}/profile`)
                .send(updateuserProfileRequest)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.OK);
        });

        it("should return a 400 status code when userId is invalid", async () => {
            const userId = "1234";

            const updateuserProfileRequest = {
                userId: userId,
                username: "mockUsername",
                name: "mockName",
                userBio: "This is a test",
                accountType: 1,
            };

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .put(`/api/users/${userId}/profile`)
                .send(updateuserProfileRequest)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body).toEqual({ userId: ["Invalid userId"] });
        });

        it("should return a 400 status code when name is not a string", async () => {
            const userId = new Types.ObjectId();

            const updateuserProfileRequest = {
                userId: userId,
                username: "mockUsername",
                name: 123,
                userBio: "This is a test",
                accountType: 1,
            };

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .put(`/api/users/${userId}/profile`)
                .send(updateuserProfileRequest)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body).toEqual({
                name: [
                    "name must be longer than or equal to 1 and shorter than or equal to 35 characters",
                    "name must be a string",
                ],
            });
        });

        it("should return a 400 status code when userBio is not a string", async () => {
            const userId = new Types.ObjectId();

            const updateuserProfileRequest = {
                userId: userId,
                username: "mockUsername",
                name: "mockName",
                userBio: 123,
                accountType: 1,
            };

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .put(`/api/users/${userId}/profile`)
                .send(updateuserProfileRequest)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body).toEqual({
                userBio: ["userBio must be a string"],
            });
        });

        it("should return a 400 status code when accountType is not a number", async () => {
            const userId = new Types.ObjectId();

            const updateuserProfileRequest = {
                userId: userId,
                username: "mockUsername",
                name: "mockName",
                userBio: "This is a test",
                accountType: "1",
            };

            const payload = { userId };
            const secretKey = process.env.SECRET_CODE;

            if (!secretKey) {
                console.log("Secret key is not defined");
                throw new Error("Secret key is not defined");
            }

            const token = await JWTUtil.sign(payload, secretKey);
            if (!token) {
                console.log("Token is not defined");
                throw new Error("Token is not defined");
            }

            const response = await request(app)
                .put(`/api/users/${userId}/profile`)
                .send(updateuserProfileRequest)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body).toEqual({
                accountType: ["accountType must be a number"],
            });
        });
    });
});
