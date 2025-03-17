import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export default abstract class BaseRepository<T, TDocument extends Document>
    implements IBaseRepository<T, TDocument>
{
    private model: Model<TDocument>;

    constructor(model: Model<TDocument>) {
        this.model = model;
    }

    abstract toEntity(doc: TDocument): T;

    public async findById(id: Types.ObjectId): Promise<T | null> {
        const doc = await this.model.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async findOne(query: FilterQuery<TDocument>): Promise<T | null> {
        const doc = await this.model.findOne(query).exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async find(query: FilterQuery<TDocument>): Promise<T[]> {
        const docs = await this.model.find(query).exec();
        return docs.map((doc) => this.toEntity(doc));
    }

    public async create(doc: Partial<TDocument>): Promise<T> {
        const entity = await this.model.create(doc);
        return this.toEntity(entity);
    }

    public async findOneAndUpdate(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<T | null> {
        const doc = await this.model
            .findOneAndUpdate(query, update, options)
            .exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async findByIdAndUpdate(
        id: Types.ObjectId,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<T | null> {
        const doc = await this.model
            .findByIdAndUpdate(id, update, options)
            .exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async updateOne(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<void> {
        await this.model.updateOne(query, update, options).exec();
    }

    public async updateMany(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<UpdateQuery<T>> {
        return await this.model.updateMany(query, update, options).exec();
    }

    public async findByIdAndDelete(id: Types.ObjectId): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }
}
