import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { ExerciseMusclesDocument } from "../../models/exerciseLibrary/exerciseMusclesModel";
import ExerciseMuscles from "../../../../app/exerciseLibrary/entity/ExerciseMuscles";
import {
    ExerciseMusclesResponse,
    ExerciseMusclesRequest,
} from "../../../../app/exerciseLibrary/dto/libraryExerciseDto";
import { Model, Types } from "mongoose";
import BaseRepository from "../BaseRepository";

export interface IExerciseMusclesRepository
    extends IBaseRepository<ExerciseMuscles, ExerciseMusclesDocument> {
    toDocument(
        request: ExerciseMusclesRequest,
    ): Partial<ExerciseMusclesDocument>;
    getExerciseMuscles(
        exerciseId: Types.ObjectId,
    ): Promise<ExerciseMusclesResponse[]>;
}

export default class ExerciseMusclesRepository
    extends BaseRepository<ExerciseMuscles, ExerciseMusclesDocument>
    implements IExerciseMusclesRepository
{
    private exerciseMusclesModel: Model<ExerciseMusclesDocument>;

    constructor(exerciseMusclesModel: Model<ExerciseMusclesDocument>) {
        super(exerciseMusclesModel);
        this.exerciseMusclesModel = exerciseMusclesModel;
    }

    toEntity(doc: ExerciseMusclesDocument): ExerciseMuscles {
        if (!doc) return null;

        return ExerciseMuscles.builder()
            .setId(doc._id)
            .setExerciseId(doc.exerciseId)
            .setMuscleId(doc.muscleId)
            .setPrimary(doc.primary)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(
        request: ExerciseMusclesRequest,
    ): Partial<ExerciseMusclesDocument> {
        return {
            exerciseId: new Types.ObjectId(request.exerciseId),
            muscleId: new Types.ObjectId(request.muscleId),
            primary: request.primary,
        };
    }

    public async getExerciseMuscles(
        exerciseId: Types.ObjectId,
    ): Promise<ExerciseMusclesResponse[]> {
        const results = await this.exerciseMusclesModel.aggregate([
            // Stage 1: Match exercise-muscle relationships for this exercise
            {
                $match: { exerciseId: exerciseId },
            },

            // Stage 2: Lookup the corresponding muscle documents
            {
                $lookup: {
                    from: "muscles",
                    localField: "muscleId",
                    foreignField: "_id",
                    as: "muscleGroups",
                },
            },
            {
                $unwind: "$muscleGroups",
            },

            // Stage 4: Project only the fields we need
            {
                $project: {
                    _id: 1,
                    muscleId: "$muscleGroups._id", // Duplicate to match your response format
                    muscleName: "$muscleGroups.name",
                    primary: 1,
                },
            },
        ]);

        const response = results.map((result) => ({
            id: result._id.toString(),
            muscle: {
                id: result.muscleId.toString(),
                name: result.muscleName,
            },
            primary: result.primary,
        }));
        console.log("ExerciseMuscles Response: ", response.toString());
        return response;
    }
}
