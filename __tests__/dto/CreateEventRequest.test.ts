import { CreateEventRequest } from "../../src/dto/request/CreateEventRequest";
import { soccerPracticeEvent } from "../mocks/eventMockData";

describe("CreateEventRequest Unit Tests", () => {
    it("should build a valid CreateEventRequest", () => {
        const createEventRequest = CreateEventRequest.builder()
            .setName(soccerPracticeEvent.name)
            .setAdmin(soccerPracticeEvent.admin)
            .setInvitees(soccerPracticeEvent.invitees)
            .setDate(soccerPracticeEvent.date)
            .setStartTime(soccerPracticeEvent.startTime)
            .setEndTime(soccerPracticeEvent.endTime)
            .setLocation(soccerPracticeEvent.location)
            .setDescription(soccerPracticeEvent.description)
            .build();

        expect(createEventRequest.getName()).toBe(soccerPracticeEvent.name);
        expect(createEventRequest.getAdmin()).toBe(soccerPracticeEvent.admin);
        expect(createEventRequest.getInvitees()).toBe(
            soccerPracticeEvent.invitees,
        );
        expect(createEventRequest.getDate()).toBe(soccerPracticeEvent.date);
        expect(createEventRequest.getStartTime()).toBe(
            soccerPracticeEvent.startTime,
        );
        expect(createEventRequest.getEndTime()).toBe(
            soccerPracticeEvent.endTime,
        );
        expect(createEventRequest.getLocation()).toBe(
            soccerPracticeEvent.location,
        );
        expect(createEventRequest.getDescription()).toBe(
            soccerPracticeEvent.description,
        );
    });
});
