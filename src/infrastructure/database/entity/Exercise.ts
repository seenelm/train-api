import { Types } from "mongoose";

export default class Exercise {
    private id: Types.ObjectId;
    private name?: string;
    private group?: string;
    private imagePath?: string;
    private weight?: string;
    private targetSets?: number;
    private targetReps?: number;
    private notes?: string;
    private completed?: boolean;
    private createdBy: Types.ObjectId;
    private sets: Types.ObjectId[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: ExerciseBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.group = builder.group;
        this.imagePath = builder.imagePath;
        this.weight = builder.weight;
        this.targetSets = builder.targetSets;
        this.targetReps = builder.targetReps;
        this.notes = builder.notes;
        this.completed = builder.completed;
        this.createdBy = builder.createdBy;
        this.sets = builder.sets;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): ExerciseBuilder {
        return new ExerciseBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getGroup(): string | undefined {
        return this.group;
    }
    public getImagePath(): string | undefined {
        return this.imagePath;
    }
    public getWeight(): string | undefined {
        return this.weight;
    }
    public getTargetSets(): number | undefined {
        return this.targetSets;
    }
    public getTargetReps(): number | undefined {
        return this.targetReps;
    }
    public getNotes(): string | undefined {
        return this.notes;
    }
    public isCompleted(): boolean | undefined {
        return this.completed;
    }
    public getCreatedBy(): Types.ObjectId {
        return this.createdBy;
    }
    public getSets(): Types.ObjectId[] {
        return this.sets;
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class ExerciseBuilder {
    id: Types.ObjectId;
    name?: string;
    group?: string;
    imagePath?: string;
    weight?: string;
    targetSets?: number;
    targetReps?: number;
    notes?: string;
    completed?: boolean;
    createdBy: Types.ObjectId;
    sets: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }
    public setName(name: string): this {
        this.name = name;
        return this;
    }
    public setGroup(group: string): this {
        this.group = group;
        return this;
    }
    public setImagePath(imagePath: string): this {
        this.imagePath = imagePath;
        return this;
    }
    public setWeight(weight: string): this {
        this.weight = weight;
        return this;
    }
    public setTargetSets(targetSets: number): this {
        this.targetSets = targetSets;
        return this;
    }
    public setTargetReps(targetReps: number): this {
        this.targetReps = targetReps;
        return this;
    }
    public setNotes(notes: string): this {
        this.notes = notes;
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
    public setSets(sets: Types.ObjectId[]): this {
        this.sets = sets;
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

    public build(): Exercise {
        return new Exercise(this);
    }
}
