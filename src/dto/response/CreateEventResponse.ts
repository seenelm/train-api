import { ObjectId } from "mongodb";
import { IEvent } from "../../model/eventModel";

export class CreateEventResponse {
    private id: ObjectId;
    private name: string;
    private admin: ObjectId[];
    private invitees: ObjectId[];
    private date: Date;
    private startTime: Date;
    private endTime: Date;
    private location?: string;
    private description?: string;

    constructor(
        id: ObjectId,
        name: string,
        admin: ObjectId[],
        invitees: ObjectId[],
        date: Date,
        startTime: Date,
        endTime: Date,
        location?: string,
        description?: string,
    ) {
        this.id = id;
        this.name = name;
        this.admin = admin;
        this.invitees = invitees;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.description = description;
    }

    static from(event: IEvent): CreateEventResponse {
        return new CreateEventResponse(
            event._id,
            event.name,
            event.admin,
            event.invitees,
            event.date,
            event.startTime,
            event.endTime,
            event.location,
            event.description,
        );
    }
}
