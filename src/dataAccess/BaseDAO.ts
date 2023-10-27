import { Document, Model, FilterQuery } from "mongoose";
import * as Errors from "../utils/errors.js";

export default abstract class BaseDAO<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(doc: object): Promise<T> {
        const entity = await this.model.create(doc).catch((error) => {
            throw new Errors.InternalServerError(error);
        });
        return entity;
    }

    public async findById(id: string, populateField?: string): Promise<T | null> {
        let query = null;
        if (populateField) {
            query = await this.model.findById(id).populate(populateField);
        } else {
            query = await this.model.findById(id);
        }

        return query;
    }

    public async findOne(query: FilterQuery<T>): Promise<T> {
        return await this.model.findOne(query);
    }
}