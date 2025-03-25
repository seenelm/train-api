import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { LibraryExerciseDocument } from "../../models/exerciseLibrary/libraryExerciseModel";
import LibraryExercise from "../../../../app/exerciseLibrary/entity/LibraryExercise";
import { Model, Types } from "mongoose";
import BaseRepository from "../BaseRepository";
import { LibaryExerciseRequest } from "../../../../app/exerciseLibrary/dto/libraryExerciseDto";

export interface ILibraryExerciseRepository
    extends IBaseRepository<LibraryExercise, LibraryExerciseDocument> {}

export default class LibraryExerciseRepository
    extends BaseRepository<LibraryExercise, LibraryExerciseDocument>
    implements ILibraryExerciseRepository
{
    private libraryExerciseModel: Model<LibraryExerciseDocument>;

    constructor(libraryExerciseModel: Model<LibraryExerciseDocument>) {
        super(libraryExerciseModel);
        this.libraryExerciseModel = libraryExerciseModel;
    }

    toEntity(doc: LibraryExerciseDocument): LibraryExercise {
        if (!doc) return null;

        return LibraryExercise.builder()
            .setId(doc._id)
            .setName(doc.name)
            .setDescription(doc.description)
            .setCategoryId(doc.categoryId)
            .setDifficulty(doc.difficulty)
            .setEquipment(doc.equipment)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(
        request: LibaryExerciseRequest,
    ): Partial<LibraryExerciseDocument> {
        if (!request) return null;

        return {
            name: request.name,
            description: request.description,
            categoryId: new Types.ObjectId(request.categoryId),
            difficulty: request.difficulty,
            equipment: request.equipment,
        };
    }
}
