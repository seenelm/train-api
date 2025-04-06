import {
    Model,
    Document,
    FilterQuery,
    UpdateQuery,
    Types,
    QueryOptions,
    CreateOptions,
} from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export default abstract class BaseRepository<T, TDocument extends Document>
    implements IBaseRepository<T, TDocument>
{
    private model: Model<TDocument>;

    constructor(model: Model<TDocument>) {
        this.model = model;
    }

    abstract toEntity(doc: TDocument): T;

    public async findById(
        id: Types.ObjectId,
        options?: object,
    ): Promise<T | null> {
        const doc = await this.model.findById(id, options).exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async findOne(
        query: FilterQuery<TDocument>,
        options?: object,
    ): Promise<T | null> {
        const doc = await this.model.findOne(query, options).exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async find(
        query: FilterQuery<TDocument>,
        options?: object,
    ): Promise<T[]> {
        const docs = await this.model.find(query, options).exec();
        return docs.map((doc) => this.toEntity(doc));
    }

    public async create(
        doc: Partial<TDocument>,
        options?: CreateOptions,
    ): Promise<T> {
        const entity = await this.model.create([doc], options);
        return this.toEntity(entity[0]);
    }

    public async insertMany(
        docs: Partial<TDocument>[],
        options?: object,
    ): Promise<T[]> {
        const entities = (await this.model.insertMany(
            docs,
            options,
        )) as unknown as TDocument[];
        return entities.map((doc) => this.toEntity(doc));
    }

    public async findOneAndUpdate(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument>,
    ): Promise<T | null> {
        const doc = await this.model
            .findOneAndUpdate(query, update, options)
            .exec();
        return doc ? this.toEntity(doc) : null;
    }

    public async findByIdAndUpdate(
        id: Types.ObjectId,
        update: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument>,
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

    public async findByIdAndDelete(
        id: Types.ObjectId,
        options?: object,
    ): Promise<void> {
        await this.model.findByIdAndDelete(id, options).exec();
    }

    public async deleteMany(
        query: FilterQuery<TDocument>,
        options?: object,
    ): Promise<void> {
        await this.model.deleteMany(query, options).exec();
    }
}
