import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { CategoryDocument } from "../../models/exerciseLibrary/categoryModel";
import Category from "../../../../app/exerciseLibrary/entity/Category";
import { Model } from "mongoose";
import BaseRepository from "../BaseRepository";
import {
    CategoryRequest,
    CategoryResponse,
} from "../../../../app/exerciseLibrary/dto/libraryExerciseDto";

export interface ICategoryRepository
    extends IBaseRepository<Category, CategoryDocument> {}

export default class CategoryRepository
    extends BaseRepository<Category, CategoryDocument>
    implements ICategoryRepository
{
    private categoryModel: Model<CategoryDocument>;

    constructor(categoryModel: Model<CategoryDocument>) {
        super(categoryModel);
        this.categoryModel = categoryModel;
    }

    toEntity(doc: CategoryDocument): Category {
        if (!doc) return null;

        return Category.builder()
            .setId(doc._id)
            .setName(doc.name)
            .setDescription(doc.description)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: CategoryRequest): Partial<CategoryDocument> {
        if (!request) return null;

        return {
            name: request.name,
            description: request.description,
        };
    }

    toResponse(entity: Category): CategoryResponse {
        if (!entity) return null;

        return {
            id: entity.getId().toString(),
            name: entity.getName(),
            description: entity.getDescription(),
        };
    }
}
