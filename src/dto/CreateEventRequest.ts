import { ObjectId } from "mongodb";

export class CreateEventRequest {
    private name: string;
    private admin: ObjectId[];
    private invitees?: ObjectId[];
    private startTime: Date;
    private endTime?: Date;
    private location?: string;
    private description?: string;

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

    static Builder = class {
        private name: string;
        private admin: ObjectId[];
        private invitees?: ObjectId[];
        private startTime: Date;
        private endTime?: Date;
        private location?: string;
        private description?: string;

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

        public build(): CreateEventRequest {
            const createEventRequest = new CreateEventRequest();
            createEventRequest.name = this.name;
            createEventRequest.admin = this.admin;
            createEventRequest.invitees = this.invitees;
            createEventRequest.startTime = this.startTime;
            createEventRequest.endTime = this.endTime;
            createEventRequest.location = this.location;
            createEventRequest.description = this.description;
            return createEventRequest;
        }
    };
}
