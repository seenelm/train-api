import { IEvent } from "../model/eventModel";

export class EventResponse {
    private id: string;
    private name: string;
    private admin: string[];
    private invitees?: string[];
    private startTime: string;
    private endTime?: string;
    private location?: string;
    private description?: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    private constructor() {}

    static builder() {
        return new this.Builder();
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getAdmin(): string[] {
        return this.admin;
    }

    public getInvitees(): string[] {
        return this.invitees;
    }

    public getStartTime(): string {
        return this.startTime;
    }

    public getEndTime(): string {
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

    static from(event: IEvent): EventResponse {
        return EventResponse.builder()
            .setId(event._id)
            .setName(event.name)
            .setAdmin(event.admin.map((admin) => admin.toString()))
            .setInvitees(event.invitees.map((invitee) => invitee.toString()))
            .setStartTime(event.startTime.toLocaleString())
            .setEndTime(event.endTime.toLocaleString())
            .setLocation(event.location)
            .setDescription(event.description)
            .setCreatedAt(event.createdAt)
            .setUpdatedAt(event.updatedAt)
            .build();
    }

    static Builder = class {
        private id: string;
        private name: string;
        private admin: string[];
        private invitees?: string[];
        private startTime: string;
        private endTime?: string;
        private location?: string;
        private description?: string;
        private createdAt?: Date;
        private updatedAt?: Date;

        public setId(id: string): this {
            this.id = id;
            return this;
        }

        public setName(name: string): this {
            this.name = name;
            return this;
        }

        public setAdmin(admin: string[]): this {
            this.admin = admin;
            return this;
        }

        public setInvitees(invitees?: string[]): this {
            this.invitees = invitees;
            return this;
        }

        public setStartTime(startTime: string): this {
            this.startTime = startTime;
            return this;
        }

        public setEndTime(endTime?: string): this {
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

        public build(): EventResponse {
            const createEventResponse = new EventResponse();
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
