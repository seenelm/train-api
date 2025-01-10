import { ObjectId } from "mongodb";
import { IEvent } from "../../src/model/eventModel";
import { CreateEventResponse } from "../../src/dto/CreateEventResponse";

describe("CreateEventResponse Unit Tests", () => {
    it("should create an instance of CreateEventResponse", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        const mockResponse = {
            id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Practice for upcoming tournament",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const response: CreateEventResponse = CreateEventResponse.builder()
            .setId(mockResponse.id)
            .setName(mockResponse.name)
            .setAdmin(mockResponse.admin)
            .setInvitees(mockResponse.invitees)
            .setStartTime(mockResponse.startTime)
            .setEndTime(mockResponse.endTime)
            .setLocation(mockResponse.location)
            .setDescription(mockResponse.description)
            .setCreatedAt(mockResponse.createdAt)
            .setUpdatedAt(mockResponse.updatedAt)
            .build();

        expect(response.getId()).toBe(mockResponse.id);
        expect(response.getName()).toBe(mockResponse.name);
        expect(response.getAdmin()).toBe(mockResponse.admin);
        expect(response.getInvitees()).toBe(mockResponse.invitees);
        expect(response.getStartTime()).toBe(startTime);
        expect(response.getEndTime()).toBe(endTime);
        expect(response.getLocation()).toBe(mockResponse.location);
        expect(response.getDescription()).toBe(mockResponse.description);
        expect(response.getCreatedAt()).toBe(mockResponse.createdAt);
        expect(response.getUpdatedAt()).toBe(mockResponse.updatedAt);
    });

    it("should create an instance of CreateEventResponse from an IEvent object", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        const event: IEvent = {
            _id: new ObjectId(),
            name: "Test Event",
            admin: [new ObjectId(), new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Test Location",
            description: "Test Description",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const response: CreateEventResponse = CreateEventResponse.from(event);

        expect(response.getId()).toBe(event._id);
        expect(response.getName()).toBe(event.name);
        expect(response.getAdmin()).toBe(event.admin);
        expect(response.getInvitees()).toBe(event.invitees);
        expect(response.getStartTime()).toBe(event.startTime);
        expect(response.getEndTime()).toBe(event.endTime);
        expect(response.getLocation()).toBe(event.location);
        expect(response.getDescription()).toBe(event.description);
        expect(response.getCreatedAt()).toBe(event.createdAt);
        expect(response.getUpdatedAt()).toBe(event.updatedAt);
    });
});
