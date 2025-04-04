import { Types } from "mongoose";

export default class Category {
    private id: Types.ObjectId;
    private name: string;
    private description?: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: CategoryBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): CategoryBuilder {
        return new CategoryBuilder();
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

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class CategoryBuilder {
    id: Types.ObjectId;
    name: string;
    description?: string;
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

    public setCreatedAt(createdAt: Date): this {
        this.createdAt = createdAt;
        return this;
    }

    public setUpdatedAt(updatedAt: Date): this {
        this.updatedAt = updatedAt;
        return this;
    }

    public build(): Category {
        return new Category(this);
    }
}
