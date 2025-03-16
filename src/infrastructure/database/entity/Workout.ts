import { Types } from "mongoose";

export default class Workout {
    private id: Types.ObjectId;
    private title?: string;
    private description?: string;
    private imagePath?: string;
    private completed?: boolean;
    private createdBy: Types.ObjectId;
    private exercises: Types.ObjectId[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: WorkoutBuilder) {
        this.id = builder.id;
        this.title = builder.title;
        this.description = builder.description;
        this.imagePath = builder.imagePath;
        this.completed = builder.completed;
        this.createdBy = builder.createdBy;
        this.exercises = builder.exercises;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): WorkoutBuilder {
        return new WorkoutBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getTitle(): string | undefined {
        return this.title;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getImagePath(): string | undefined {
        return this.imagePath;
    }
    public isCompleted(): boolean | undefined {
        return this.completed;
    }
    public getCreatedBy(): Types.ObjectId {
        return this.createdBy;
    }
    public getExercises(): Types.ObjectId[] {
        return this.exercises;
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class WorkoutBuilder {
    id: Types.ObjectId;
    title?: string;
    description?: string;
    imagePath?: string;
    completed?: boolean;
    createdBy: Types.ObjectId;
    exercises: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }
    public setTitle(title: string): this {
        this.title = title;
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
    public setCompleted(completed: boolean): this {
        this.completed = completed;
        return this;
    }
    public setCreatedBy(createdBy: Types.ObjectId): this {
        this.createdBy = createdBy;
        return this;
    }
    public setExercises(exercises: Types.ObjectId[]): this {
        this.exercises = exercises;
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
    public build(): Workout {
        return new Workout(this);
    }
}
