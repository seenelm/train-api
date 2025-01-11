import { UserEventEntity } from "../../src/entity/UserEventEntity";
import { EventStatus } from "../../src/common/enums";
import { IEvent } from "../../src/model/eventModel";
import { ObjectId } from "mongodb";

describe("UserEventEntity", () => {
    it("should create a UserEventEntity", () => {
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

        const userEventEntity = new UserEventEntity(mockStatus, mockEvent);

        expect(userEventEntity.getStatus()).toBe(mockStatus);
        expect(userEventEntity.getEvent()).toBe(mockEvent);
    });

    it("should set the status of a UserEventEntity", () => {
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

        const userEventEntity = new UserEventEntity(mockStatus, mockEvent);
        userEventEntity.setStatus(EventStatus.Pending);

        expect(userEventEntity.getStatus()).toBe(EventStatus.Pending);
    });

    it("should set the event of a UserEventEntity", () => {
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

        const userEventEntity = new UserEventEntity(mockStatus, mockEvent);

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

        userEventEntity.setEvent(newMockEvent);

        expect(userEventEntity.getEvent()).toBe(newMockEvent);
    });
});
