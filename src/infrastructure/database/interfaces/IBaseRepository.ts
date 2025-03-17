import { FilterQuery, UpdateQuery, Types, Document } from "mongoose";
export interface IBaseRepository<T, TDocument> {
    findById(id: Types.ObjectId): Promise<T | null>;
    findOne(query: FilterQuery<TDocument>): Promise<T | null>;
    find(query: FilterQuery<TDocument>): Promise<T[]>;
    create(doc: Partial<TDocument>): Promise<T>;
    findOneAndUpdate(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<T | null>;
    findByIdAndUpdate(
        id: Types.ObjectId,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<T | null>;
    updateOne(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<void>;
    updateMany(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: object,
    ): Promise<UpdateQuery<T>>;
    findByIdAndDelete(id: Types.ObjectId): Promise<void>;
}
