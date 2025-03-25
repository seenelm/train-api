import { Types } from "mongoose";

export default class LibraryExercise {
    private id: Types.ObjectId;
    private name: string;
    private description: string;
    private categoryId: Types.ObjectId;
    private difficulty: string;
    private equipment?: string[];
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: LibraryExerciseBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.categoryId = builder.categoryId;
        this.difficulty = builder.difficulty;
        this.equipment = builder.equipment;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): LibraryExerciseBuilder {
        return new LibraryExerciseBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCategoryId(): Types.ObjectId {
        return this.categoryId;
    }

    public getDifficulty(): string {
        return this.difficulty;
    }

    public getEquipment(): string[] {
        return this.equipment;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}

export class LibraryExerciseBuilder {
    id: Types.ObjectId;
    name: string;
    description: string;
    categoryId: Types.ObjectId;
    difficulty: string;
    equipment?: string[];
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

    public setDescription(description: string): this {
        this.description = description;
        return this;
    }

    public setCategoryId(categoryId: Types.ObjectId): this {
        this.categoryId = categoryId;
        return this;
    }

    public setDifficulty(difficulty: string): this {
        this.difficulty = difficulty;
        return this;
    }

    public setEquipment(equipment: string[]): this {
        this.equipment = equipment;
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

    public build(): LibraryExercise {
        return new LibraryExercise(this);
    }
}
