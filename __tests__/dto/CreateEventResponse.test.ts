import { ObjectId } from "mongodb";
import { IEvent } from "../../src/model/eventModel";
import { CreateEventResponse } from "../../src/dto/response/CreateEventResponse";

describe("CreateEventResponse Unit Tests", () => {
    it("should create an instance of CreateEventResponse", () => {
        const id = new ObjectId();
        const name = "Test Event";
        const admin = [new ObjectId(), new ObjectId()];
        const invitees = [new ObjectId(), new ObjectId()];
        const date = new Date();
        const startTime = new Date();
        const endTime = new Date();
        const location = "Test Location";
        const description = "Test Description";

        const response: CreateEventResponse = new CreateEventResponse(
            id,
            name,
            admin,
            invitees,
            date,
            startTime,
            endTime,
            location,
            description,
        );

        expect(response).toBeInstanceOf(CreateEventResponse);
        expect(response.getId()).toBe(id);
        expect(response.getName()).toBe(name);
        expect(response.getAdmin()).toBe(admin);
        expect(response.getInvitees()).toBe(invitees);
        expect(response.getDate()).toBe(date);
        expect(response.getStartTime()).toBe(startTime);
        expect(response.getEndTime()).toBe(endTime);
        expect(response.getLocation()).toBe(location);
        expect(response.getDescription()).toBe(description);
    });

    it("should create an instance of CreateEventResponse from an IEvent object", () => {
        const event: IEvent = {
            _id: new ObjectId(),
            name: "Test Event",
            admin: [new ObjectId(), new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            location: "Test Location",
            description: "Test Description",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const response = CreateEventResponse.from(event);

        expect(response).toBeInstanceOf(CreateEventResponse);
        expect(response.getId()).toBe(event._id);
        expect(response.getName()).toBe(event.name);
        expect(response.getAdmin()).toBe(event.admin);
        expect(response.getInvitees()).toBe(event.invitees);
        expect(response.getDate()).toBe(event.date);
        expect(response.getStartTime()).toBe(event.startTime);
        expect(response.getEndTime()).toBe(event.endTime);
        expect(response.getLocation()).toBe(event.location);
        expect(response.getDescription()).toBe(event.description);
    });
});
