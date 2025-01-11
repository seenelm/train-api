import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { UserModel, IUser } from "../../src/model/userModel";

describe("UserModel Unit Tests", () => {
    beforeAll(() => {
        jest.mock("../../src/model/userModel");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create and save a user", async () => {
        const mockUser = {
            _id: new ObjectId(),
            username: "testuser",
            password: "password",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IUser;

        UserModel.prototype.save = jest.fn().mockResolvedValue(mockUser);

        const user = new UserModel({
            username: mockUser.username,
            password: mockUser.password,
            isActive: mockUser.isActive,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt,
        });

        const savedUser = await new UserModel(user).save();

        expect(savedUser.username).toBe(mockUser.username);
        expect(savedUser.password).toBe(mockUser.password);
        expect(savedUser.isActive).toBe(mockUser.isActive);
        expect(savedUser.createdAt).toBe(mockUser.createdAt);
        expect(savedUser.updatedAt).toBe(mockUser.updatedAt);
    });

    it("should validate required fields", async () => {
        const user = new UserModel({
            username: "",
            password: "",
            isActive: null,
        });

        try {
            await user.validate();
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                expect(err.errors.username.message).toBe(
                    "Path `username` is required.",
                );
                expect(err.errors.password.message).toBe(
                    "Path `password` is required.",
                );
                expect(err.errors.isActive.message).toBe(
                    "Path `isActive` is required.",
                );
            }
        }
    });
});
