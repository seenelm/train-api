import { ObjectId } from "mongodb";
import { IEvent } from "../../src/model/eventModel";

export const soccerPracticeEvent: IEvent = {
    name: "Soccer Practice",
    admin: [new ObjectId()],
    invitees: [new ObjectId(), new ObjectId()],
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: "Loudoun Soccer Park",
    description: "Practice for upcoming tournament",
    createdAt: new Date(),
    updatedAt: new Date(),
} as IEvent;
