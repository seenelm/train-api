import { Event } from "../../src/model/eventModel";
import { ObjectId } from "mongodb";
import { soccerPracticeEvent } from "../mocks/eventMockData";
import mongoose from "mongoose";

describe("EventModel Unit Tests", () => {
    beforeAll(() => {
        jest.mock("../../src/model/eventModel");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create and save an event", async () => {
        Event.prototype.save = jest.fn().mockResolvedValue(soccerPracticeEvent);

        const event = new Event({
            name: soccerPracticeEvent.name,
            admin: soccerPracticeEvent.admin,
            invitees: soccerPracticeEvent.invitees,
            date: soccerPracticeEvent.date,
            startTime: soccerPracticeEvent.startTime,
            endTime: soccerPracticeEvent.endTime,
            location: soccerPracticeEvent.location,
            description: soccerPracticeEvent.description,
            createdAt: soccerPracticeEvent.createdAt,
            updatedAt: soccerPracticeEvent.updatedAt,
        });

        const savedEvent = await new Event(event).save();

        expect(savedEvent.name).toBe(soccerPracticeEvent.name);
        expect(savedEvent.admin).toBe(soccerPracticeEvent.admin);
        expect(savedEvent.invitees).toBe(soccerPracticeEvent.invitees);
        expect(savedEvent.date).toBe(soccerPracticeEvent.date);
        expect(savedEvent.startTime).toBe(soccerPracticeEvent.startTime);
        expect(savedEvent.endTime).toBe(soccerPracticeEvent.endTime);
        expect(savedEvent.location).toBe(soccerPracticeEvent.location);
        expect(savedEvent.description).toBe(soccerPracticeEvent.description);
        expect(savedEvent.createdAt).toBe(soccerPracticeEvent.createdAt);
        expect(savedEvent.updatedAt).toBe(soccerPracticeEvent.updatedAt);
    });

    it("should validate required fields", async () => {
        const event = new Event({
            name: "",
            admin: [new ObjectId()],
            invitees: [new ObjectId()],
            date: null,
            startTime: null,
            endTime: null,
            location: "",
            description: "",
        });

        try {
            await event.validate();
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                expect(error.errors.name.message).toBe(
                    "Path `name` is required.",
                );
                expect(error.errors.date.message).toBe(
                    "Path `date` is required.",
                );
                expect(error.errors.startTime.message).toBe(
                    "Path `startTime` is required.",
                );
                expect(error.errors.endTime.message).toBe(
                    "Path `endTime` is required.",
                );
            }
        }
    });
});
