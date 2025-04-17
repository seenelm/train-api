import { Types } from "mongoose";

export default class User {
    private id: Types.ObjectId;
    private username: string;
    private password: string;
    private isActive: boolean;
    private deviceToken?: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: UserBuilder) {
        this.id = builder.id;
        this.username = builder.username;
        this.password = builder.password;
        this.isActive = builder.isActive;
        this.deviceToken = builder.deviceToken;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): UserBuilder {
        return new UserBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public getDeviceToken(): string | undefined {
        return this.deviceToken;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}

class UserBuilder {
    id: Types.ObjectId;
    username: string;
    password: string;
    isActive: boolean;
    deviceToken?: string;
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }

    public setUsername(username: string): this {
        this.username = username;
        return this;
    }

    public setPassword(password: string): this {
        this.password = password;
        return this;
    }

    public setIsActive(isActive: boolean): this {
        this.isActive = isActive;
        return this;
    }

    public setDeviceToken(deviceToken: string): this {
        this.deviceToken = deviceToken;
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

    public build(): User {
        return new User(this);
    }
}
