import BaseRepository from "./BaseRepository";
import Exercise from "../entity/Exercise";
import { ExerciseDocument } from "../models/exerciseModel";
import { IExerciseRepository } from "../interfaces/IExerciseRepository";
import { ExerciseModel } from "../models/exerciseModel";
import {
    ExerciseRequest,
    ExerciseResponse,
} from "../../../app/programs/dto/exerciseDto";
import { Types } from "mongoose";

export default class ExerciseRepository
    extends BaseRepository<Exercise, ExerciseDocument>
    implements IExerciseRepository
{
    constructor() {
        super(ExerciseModel);
    }

    toEntity(doc: ExerciseDocument): Exercise {
        if (!doc) return null;

        return Exercise.builder()
            .setId(doc._id)
            .setName(doc.name)
            .setGroup(doc.group)
            .setImagePath(doc.imagePath)
            .setWeight(doc.weight)
            .setTargetSets(doc.targetSets)
            .setTargetReps(doc.targetReps)
            .setNotes(doc.notes)
            .setCompleted(doc.completed)
            .setCreatedBy(doc.createdBy)
            .setSets(doc.sets)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: ExerciseRequest): Partial<ExerciseDocument> {
        if (!request) return null;

        return {
            name: request.name,
            group: request.group,
            imagePath: request.imagePath,
            weight: request.weight,
            targetSets: request.targetSets,
            targetReps: request.targetReps,
            notes: request.notes,
            completed: request.completed,
            createdBy: new Types.ObjectId(request.createdBy),
            sets: request.sets.map((setId) => new Types.ObjectId(setId)),
        };
    }

    toResponse(exercise: Exercise): ExerciseResponse {
        if (!exercise) return null;

        return {
            id: exercise.getId().toString(),
            name: exercise.getName(),
            group: exercise.getGroup(),
            imagePath: exercise.getImagePath(),
            weight: exercise.getWeight(),
            targetSets: exercise.getTargetSets(),
            targetReps: exercise.getTargetReps(),
            notes: exercise.getNotes(),
            completed: exercise.isCompleted(),
            createdBy: exercise.getCreatedBy().toString(),
            sets: exercise.getSets().map((setId) => setId.toString()),
        };
    }
}
