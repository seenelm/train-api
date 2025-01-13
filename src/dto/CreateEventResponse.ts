import { ObjectId } from "mongodb";
import { IEvent } from "../model/eventModel";

export class CreateEventResponse {
    private id: ObjectId;
    private name: string;
    private admin: ObjectId[];
    private invitees?: ObjectId[];
    private startTime: Date;
    private endTime?: Date;
    private location?: string;
    private description?: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    private constructor() {}

    static builder() {
        return new this.Builder();
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

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    static from(event: IEvent): CreateEventResponse {
        return CreateEventResponse.builder()
            .setId(event._id)
            .setName(event.name)
            .setAdmin(event.admin)
            .setInvitees(event.invitees)
            .setStartTime(event.startTime)
            .setEndTime(event.endTime)
            .setLocation(event.location)
            .setDescription(event.description)
            .setCreatedAt(event.createdAt)
            .setUpdatedAt(event.updatedAt)
            .build();
    }

    static Builder = class {
        private id: ObjectId;
        private name: string;
        private admin: ObjectId[];
        private invitees?: ObjectId[];
        private startTime: Date;
        private endTime?: Date;
        private location?: string;
        private description?: string;
        private createdAt?: Date;
        private updatedAt?: Date;

        public setId(id: ObjectId): this {
            this.id = id;
            return this;
        }

        public setName(name: string): this {
            this.name = name;
            return this;
        }

        public setAdmin(admin: ObjectId[]): this {
            this.admin = admin;
            return this;
        }

        public setInvitees(invitees?: ObjectId[]): this {
            this.invitees = invitees;
            return this;
        }

        public setStartTime(startTime: Date): this {
            this.startTime = startTime;
            return this;
        }

        public setEndTime(endTime?: Date): this {
            this.endTime = endTime;
            return this;
        }

        public setLocation(location?: string): this {
            this.location = location;
            return this;
        }

        public setDescription(description?: string): this {
            this.description = description;
            return this;
        }

        public setCreatedAt(createdAt?: Date): this {
            this.createdAt = createdAt;
            return this;
        }

        public setUpdatedAt(updatedAt?: Date): this {
            this.updatedAt = updatedAt;
            return this;
        }

        public build(): CreateEventResponse {
            const createEventResponse = new CreateEventResponse();
            createEventResponse.id = this.id;
            createEventResponse.name = this.name;
            createEventResponse.admin = this.admin;
            createEventResponse.invitees = this.invitees;
            createEventResponse.startTime = this.startTime;
            createEventResponse.endTime = this.endTime;
            createEventResponse.location = this.location;
            createEventResponse.description = this.description;
            createEventResponse.createdAt = this.createdAt;
            createEventResponse.updatedAt = this.updatedAt;
            return createEventResponse;
        }
    };
}
