import { Types } from "mongoose";

export default class Week {
    private id: Types.ObjectId;
    private programId: Types.ObjectId;
    private name: string;
    private description?: string;
    private imagePath?: string;
    private weekNumber: number;
    private workouts: Types.ObjectId[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: WeekBuilder) {
        this.id = builder.id;
        this.programId = builder.programId;
        this.name = builder.name;
        this.description = builder.description;
        this.imagePath = builder.imagePath;
        this.weekNumber = builder.weekNumber;
        this.workouts = builder.workouts;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): WeekBuilder {
        return new WeekBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getProgramId(): Types.ObjectId {
        return this.programId;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getImagePath(): string | undefined {
        return this.imagePath;
    }
    public getWeekNumber(): number {
        return this.weekNumber;
    }
    public getWorkouts(): Types.ObjectId[] {
        return this.workouts;
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class WeekBuilder {
    id: Types.ObjectId;
    programId: Types.ObjectId;
    name: string;
    description?: string;
    imagePath?: string;
    weekNumber: number;
    workouts: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }
    public setProgramId(programId: Types.ObjectId): this {
        this.programId = programId;
        return this;
    }
    public setName(name: string): this {
        this.name = name;
        return this;
    }
    public setDescription(description: string): this {
        this.description = description;
        return this;
    }
    public setImagePath(imagePath: string): this {
        this.imagePath = imagePath;
        return this;
    }
    public setWeekNumber(weekNumber: number): this {
        this.weekNumber = weekNumber;
        return this;
    }
    public setWorkouts(workouts: Types.ObjectId[]): this {
        this.workouts = workouts;
        return this;
    }
    public setCreatedAt(createdAt: Date): this {
        this.createdAt = createdAt;
        return this;
    }
    public setUpdatedAt(updatedAt: Date): this {
        this.updatedAt = updatedAt;
        return this;
    }
    public build(): Week {
        return new Week(this);
    }
}
