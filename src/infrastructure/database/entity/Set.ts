import { Types } from "mongoose";

export default class Set {
    private id: Types.ObjectId;
    private weight?: number;
    private reps?: number;
    private completed?: boolean;
    private imagePath?: string;
    private link?: string;
    private createdBy: Types.ObjectId;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: SetBuilder) {
        this.id = builder.id;
        this.weight = builder.weight;
        this.reps = builder.reps;
        this.completed = builder.completed;
        this.imagePath = builder.imagePath;
        this.link = builder.link;
        this.createdBy = builder.createdBy;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): SetBuilder {
        return new SetBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getWeight(): number | undefined {
        return this.weight;
    }
    public getReps(): number | undefined {
        return this.reps;
    }
    public getCompleted(): boolean | undefined {
        return this.completed;
    }
    public getImagePath(): string | undefined {
        return this.imagePath;
    }
    public getLink(): string | undefined {
        return this.link;
    }
    public getCreatedBy(): Types.ObjectId {
        return this.createdBy;
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class SetBuilder {
    id: Types.ObjectId;
    weight?: number;
    reps?: number;
    completed?: boolean;
    imagePath?: string;
    link?: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }
    public setWeight(weight: number): this {
        this.weight = weight;
        return this;
    }
    public setReps(reps: number): this {
        this.reps = reps;
        return this;
    }
    public setCompleted(completed: boolean): this {
        this.completed = completed;
        return this;
    }
    public setImagePath(imagePath: string): this {
        this.imagePath = imagePath;
        return this;
    }
    public setLink(link: string): this {
        this.link = link;
        return this;
    }
    public setCreatedBy(createdBy: Types.ObjectId): this {
        this.createdBy = createdBy;
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

    public build(): Set {
        return new Set(this);
    }
}
