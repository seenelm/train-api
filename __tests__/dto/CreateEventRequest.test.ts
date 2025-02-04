import { CreateEventRequest } from "../../src/dto/CreateEventRequest";
import { ObjectId } from "mongodb";

describe("CreateEventRequest Unit Tests", () => {
    it("should build a valid CreateEventRequest", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        const mockRequest = {
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Practice for upcoming tournament",
        };

        const createEventRequest = CreateEventRequest.builder()
            .setName(mockRequest.name)
            .setAdmin(mockRequest.admin)
            .setInvitees(mockRequest.invitees)
            .setStartTime(mockRequest.startTime)
            .setEndTime(mockRequest.endTime)
            .setLocation(mockRequest.location)
            .setDescription(mockRequest.description)
            .build();

        expect(createEventRequest.getName()).toBe(mockRequest.name);
        expect(createEventRequest.getAdmin()).toBe(mockRequest.admin);
        expect(createEventRequest.getInvitees()).toBe(mockRequest.invitees);
        expect(createEventRequest.getStartTime()).toBe(mockRequest.startTime);
        expect(createEventRequest.getEndTime()).toBe(mockRequest.endTime);
        expect(createEventRequest.getLocation()).toBe(mockRequest.location);
        expect(createEventRequest.getDescription()).toBe(
            mockRequest.description,
        );
    });

    it("should update the CreateEventRequest", () => {});
});
