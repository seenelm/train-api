import {
    Document,
    Model,
    FilterQuery,
    Types,
    Query,
    UpdateQuery,
} from "mongoose";
import * as Errors from "../utils/errors";

export default abstract class BaseDAO<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(doc: object | Array<T>, options?: object): Promise<T> {
        const entity = await this.model
            .create([doc], options)
            .catch((error) => {
                throw new Errors.InternalServerError(error);
            });
        return entity[0];
    }
    public async find(query: FilterQuery<T>): Promise<T[]> {
        return await this.model.find(query).exec();
    }

    public async findById(id: Types.ObjectId): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    public async findByIdAndDelete(id: Types.ObjectId): Promise<T | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    public async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    public async findOneAndUpdate(
        filter: object,
        update: object,
        options: object,
    ): Promise<T | null> {
        const entity = await this.model
            .findOneAndUpdate(filter, update, options)
            .exec();
        return entity;
    }

    public async updateOne(
        filter: object,
        update: object,
        options?: object,
    ): Promise<void> {
        await this.model.updateOne(filter, update, options).exec();
    }

    public async updateMany(
        filter: object,
        update: object,
        options?: object,
    ): Promise<UpdateQuery<T>> {
        const entities = await this.model
            .updateMany(filter, update, options)
            .exec();
        return entities;
    }
}
