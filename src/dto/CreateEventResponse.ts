import { ObjectId } from "mongodb";
import { IEvent } from "../model/eventModel";

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
    private createdAt?: Date;
    private updatedAt?: Date;

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
        createdAt?: Date,
        updatedAt?: Date,
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getId(): ObjectId {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getAdmin(): ObjectId[] {
        return this.admin;
    }

    public getInvitees(): ObjectId[] {
        return this.invitees;
    }

    public getDate(): Date {
        return this.date;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }

    public getLocation(): string | undefined {
        return this.location;
    }

    public getDescription(): string | undefined {
        return this.description;
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
            event.createdAt,
            event.updatedAt,
        );
    }
}
