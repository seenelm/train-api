import { Types } from "mongoose";
import { RequestValidationError } from "../../utils/errors";

export class CreateEventRequest {
    private name!: string;
    private admin!: Types.ObjectId[];
    private invitees!: Types.ObjectId[];
    private date!: Date;
    private startTime!: Date;
    private endTime!: Date;
    private location?: string;
    private description?: string;

    private constructor() {}

    static builder() {
        return new this.Builder();
    }

    public getName(): string {
        return this.name;
    }

    public getAdmin(): Types.ObjectId[] {
        return this.admin;
    }

    public getInvitees(): Types.ObjectId[] {
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

    public validate(): void {
        const errors: string[] = [];

        if (
            !this.name ||
            typeof this.name !== "string" ||
            this.name.trim().length === 0
        ) {
            errors.push("Name is required and must be a non-empty string.");
        }

        if (
            !this.admin ||
            !Array.isArray(this.admin) ||
            this.admin.length === 0
        ) {
            errors.push(
                "Admin is required and must be a non-empty array of ObjectIds.",
            );
        }

        if (!this.invitees || !Array.isArray(this.invitees)) {
            errors.push("Invitees must be an array of ObjectIds.");
        }

        if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
            errors.push("Date is required and must be a valid Date object.");
        }

        if (
            !(this.startTime instanceof Date) ||
            isNaN(this.startTime.getTime())
        ) {
            errors.push(
                "Start time is required and must be a valid Date object.",
            );
        }

        if (!(this.endTime instanceof Date) || isNaN(this.endTime.getTime())) {
            errors.push(
                "End time is required and must be a valid Date object.",
            );
        }

        if (this.location && typeof this.location !== "string") {
            errors.push("Location must be a string.");
        }

        if (this.description && typeof this.description !== "string") {
            errors.push("Description must be a string.");
        }

        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    }

    static Builder = class {
        private name!: string;
        private admin!: Types.ObjectId[];
        private invitees!: Types.ObjectId[];
        private date!: Date;
        private startTime!: Date;
        private endTime!: Date;
        private location?: string;
        private description?: string;

        public setName(name: string): this {
            this.name = name;
            return this;
        }

        public setAdmin(admin: Types.ObjectId[]): this {
            this.admin = admin;
            return this;
        }

        public setInvitees(invitees: Types.ObjectId[]): this {
            this.invitees = invitees;
            return this;
        }

        public setDate(date: Date): this {
            this.date = date;
            return this;
        }

        public setStartTime(startTime: Date): this {
            this.startTime = startTime;
            return this;
        }

        public setEndTime(endTime: Date): this {
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
            createEventRequest.validate();
            createEventRequest.name = this.name;
            createEventRequest.admin = this.admin;
            createEventRequest.invitees = this.invitees;
            createEventRequest.date = this.date;
            createEventRequest.startTime = this.startTime;
            createEventRequest.endTime = this.endTime;
            createEventRequest.location = this.location;
            createEventRequest.description = this.description;
            return createEventRequest;
        }
    };
}
