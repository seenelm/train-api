import { Document, Model, FilterQuery, Types } from "mongoose";
import * as Errors from "../utils/errors";

export default abstract class BaseDAO<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(doc: object | Array<T>): Promise<T> {
        const entity = await this.model.create(doc).catch((error) => {
            throw new Errors.InternalServerError(error);
        });
        return entity;
    }

    public async findById(id: Types.ObjectId | string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    public async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    public async findOneAndUpdate(filter: object, update: object, options: object): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, update, options).exec();
    }
}