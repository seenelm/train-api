import { UserEventResponse } from "../../src/dto/UserEventResponse";
import { IEvent } from "../../src/model/eventModel";
import { EventStatus } from "../../src/common/enums";
import { ObjectId } from "mongodb";
import { UserEventEntity } from "../../src/entity/UserEventEntity";

describe("UserEventResponse", () => {
    it("should create a UserEventResponse", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        const mockStatus = EventStatus.Accepted;

        const mockEvent = {
            _id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Bring your own soccer ball",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const userEventResponse = new UserEventResponse(mockStatus, mockEvent);

        expect(userEventResponse.getStatus()).toBe(mockStatus);
        expect(userEventResponse.getEvent()).toBe(mockEvent);
    });

    it("should set the status of a UserEventResponse", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        const mockStatus = EventStatus.Accepted;

        const mockEvent = {
            _id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Bring your own soccer ball",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const userEventResponse = new UserEventResponse(mockStatus, mockEvent);
        userEventResponse.setStatus(EventStatus.Pending);

        expect(userEventResponse.getStatus()).toBe(EventStatus.Pending);
    });

    it("should set the event of a UserEventResponse", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        const mockStatus = EventStatus.Accepted;

        const mockEvent = {
            _id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Bring your own soccer ball",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const userEventResponse = new UserEventResponse(mockStatus, mockEvent);

        const newMockEvent = {
            _id: new ObjectId(),
            name: "Basketball Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Duke University",
            description: "Practice for upcoming tournament",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        userEventResponse.setEvent(newMockEvent);

        expect(userEventResponse.getEvent()).toBe(newMockEvent);
    });

    it("should create a list of UserEventResponse objects", () => {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        const mockEvent1 = {
            _id: new ObjectId(),
            name: "Soccer Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Loudoun Soccer Park",
            description: "Bring your own soccer ball",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const mockEvent2 = {
            _id: new ObjectId(),
            name: "Basketball Practice",
            admin: [new ObjectId()],
            invitees: [new ObjectId(), new ObjectId()],
            startTime,
            endTime,
            location: "Duke University",
            description: "Practice for upcoming tournament",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as IEvent;

        const userEventEntity1 = new UserEventEntity(
            EventStatus.Pending,
            mockEvent1,
        );
        const userEventEntity2 = new UserEventEntity(
            EventStatus.Accepted,
            mockEvent2,
        );

        const userEventResponseList = UserEventResponse.from([
            userEventEntity1,
            userEventEntity2,
        ]);

        expect(userEventResponseList).toEqual([
            userEventEntity1,
            userEventEntity2,
        ]);
    });
});
