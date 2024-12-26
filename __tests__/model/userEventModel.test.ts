import { UserEvent } from "../../src/model/userEventModel";
import { userEventMockData } from "../mocks/userEventMockData";
import mongoose from "mongoose";

describe("UserEventModel Unit Tests", () => {
    beforeAll(() => {
        jest.mock("../../src/model/userEventModel");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create and save a user event", async () => {
        UserEvent.prototype.save = jest
            .fn()
            .mockResolvedValue(userEventMockData[0]);

        const userEvent = new UserEvent({
            userId: userEventMockData[0].userId,
            events: userEventMockData[0].events,
            createdAt: userEventMockData[0].createdAt,
            updatedAt: userEventMockData[0].updatedAt,
        });

        const savedUserEvent = await new UserEvent(userEvent).save();

        expect(savedUserEvent.userId).toBe(userEventMockData[0].userId);
        expect(savedUserEvent.events).toBe(userEventMockData[0].events);
        expect(savedUserEvent.createdAt).toBe(userEventMockData[0].createdAt);
        expect(savedUserEvent.updatedAt).toBe(userEventMockData[0].updatedAt);
    });

    it("should validate required fields", async () => {
        const userEvent = new UserEvent({
            userId: null,
            events: [],
        });

        try {
            await userEvent.validate();
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                expect(error.errors.userId.message).toBe(
                    "Path `userId` is required.",
                );
            }
        }
    });
});
