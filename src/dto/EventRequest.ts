import { ObjectId } from "mongodb";
import AlertRequest from "./AlertRequest";

export class EventRequest {
    private name: string;
    private admin: ObjectId[];
    private invitees?: ObjectId[];
    private startTime: Date;
    private endTime?: Date;
    private location?: string;
    private description?: string;
    private alertRequest?: AlertRequest;

    private constructor() {}

    static builder() {
        return new this.Builder();
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

    public getAlertRequest(): AlertRequest {
        return this.alertRequest;
    }

    static Builder = class {
        private name: string;
        private admin: ObjectId[];
        private invitees?: ObjectId[];
        private startTime: Date;
        private endTime?: Date;
        private location?: string;
        private description?: string;
        private alertRequest?: AlertRequest;

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

        public setAlertRequest(alertRequest?: AlertRequest): this {
            this.alertRequest = alertRequest;
            return this;
        }

        public build(): EventRequest {
            const createEventRequest = new EventRequest();
            createEventRequest.name = this.name;
            createEventRequest.admin = this.admin;
            createEventRequest.invitees = this.invitees;
            createEventRequest.startTime = this.startTime;
            createEventRequest.endTime = this.endTime;
            createEventRequest.location = this.location;
            createEventRequest.description = this.description;
            createEventRequest.alertRequest = this.alertRequest;
            return createEventRequest;
        }
    };
}
