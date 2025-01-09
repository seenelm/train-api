import { Event, IEvent } from "../../src/model/eventModel";
import { ObjectId } from "mongodb";
import { soccerPracticeEvent as mockEvent } from "../mocks/eventMockData";
import mongoose from "mongoose";

describe("EventModel Unit Tests", () => {
    beforeAll(() => {
        jest.mock("../../src/model/eventModel");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create and save an event", async () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        const mockEvent = {
            _id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime: startTime,
            endTime: endTime,
            location: "Loudoun Soccer Park",
            description: "Practice for upcoming tournament",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        Event.prototype.save = jest.fn().mockResolvedValue(mockEvent);

        const event = new Event({
            name: mockEvent.name,
            admin: mockEvent.admin,
            invitees: mockEvent.invitees,
            startTime: mockEvent.startTime,
            endTime: mockEvent.endTime,
            location: mockEvent.location,
            description: mockEvent.description,
            createdAt: mockEvent.createdAt,
            updatedAt: mockEvent.updatedAt,
        });

        const savedEvent = await new Event(event).save();

        expect(savedEvent.name).toBe(mockEvent.name);
        expect(savedEvent.admin).toBe(mockEvent.admin);
        expect(savedEvent.invitees).toBe(mockEvent.invitees);
        expect(savedEvent.startTime).toBe(mockEvent.startTime);
        expect(savedEvent.endTime).toBe(mockEvent.endTime);
        expect(savedEvent.location).toBe(mockEvent.location);
        expect(savedEvent.description).toBe(mockEvent.description);
        expect(savedEvent.createdAt).toBe(mockEvent.createdAt);
        expect(savedEvent.updatedAt).toBe(mockEvent.updatedAt);
    });

    it("should validate required fields", async () => {
        const event = new Event({
            name: "",
            admin: null,
            invitees: [new ObjectId()],
            startTime: null,
            endTime: new Date(),
            location: "",
            description: "",
        });

        try {
            await event.validate();
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                console.log(error.errors.name.message);
                expect(error.errors.name.message).toBe(
                    "Path `name` is required.",
                );
                expect(error.errors.admin.message).toBe(
                    "Path `admin` is required.",
                );
                expect(error.errors.startTime.message).toBe(
                    "Path `startTime` is required.",
                );
            }
        }
    });
});
