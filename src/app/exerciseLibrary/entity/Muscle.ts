import { Types } from "mongoose";

export default class Muscle {
    private id: Types.ObjectId;
    private name: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(
        id: Types.ObjectId,
        name: string,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public setId(id: Types.ObjectId): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }

    public setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }

    public getId(): Types.ObjectId {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}
