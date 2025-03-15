import { Types } from "mongoose";

export default class Program {
    private id: Types.ObjectId;
    private name: string;
    private description?: string;
    private category?: string;
    private imagePath?: string;
    private createdBy: Types.ObjectId;
    private weeks: Types.ObjectId[];
    private difficulty?: string;
    private numWeeks?: number;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: ProgramBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.category = builder.category;
        this.imagePath = builder.imagePath;
        this.createdBy = builder.createdBy;
        this.weeks = builder.weeks;
        this.difficulty = builder.difficulty;
        this.numWeeks = builder.numWeeks;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): ProgramBuilder {
        return new ProgramBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getCategory(): string | undefined {
        return this.category;
    }
    public getImagePath(): string | undefined {
        return this.imagePath;
    }
    public getCreatedBy(): Types.ObjectId {
        return this.createdBy;
    }
    public getWeeks(): Types.ObjectId[] {
        return this.weeks;
    }
    public getDifficulty(): string | undefined {
        return this.difficulty;
    }
    public getNumWeeks(): number | undefined {
        return this.numWeeks;
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    public setWeeks(weeks: Types.ObjectId[]): void {
        this.weeks = weeks;
    }
}

class ProgramBuilder {
    id: Types.ObjectId;
    name: string;
    description?: string;
    category?: string;
    imagePath?: string;
    createdBy: Types.ObjectId;
    weeks: Types.ObjectId[];
    numWeeks?: number;
    difficulty?: string;
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
    public setDescription(description?: string): this {
        this.description = description;
        return this;
    }
    public setCategory(category?: string): this {
        this.category = category;
        return this;
    }
    public setImagePath(imagePath?: string): this {
        this.imagePath = imagePath;
        return this;
    }
    public setCreatedBy(createdBy: Types.ObjectId): this {
        this.createdBy = createdBy;
        return this;
    }
    public setWeeks(weeks: Types.ObjectId[]): this {
        this.weeks = weeks;
        return this;
    }
    public setDifficulty(difficulty?: string): this {
        this.difficulty = difficulty;
        return this;
    }
    public setNumWeeks(numWeeks?: number): this {
        this.numWeeks = numWeeks;
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

    public build(): Program {
        return new Program(this);
    }
}
