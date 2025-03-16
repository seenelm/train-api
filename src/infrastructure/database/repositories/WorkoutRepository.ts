import BaseRepository from "./BaseRepository";
import Workout from "../entity/Workout";
import { WorkoutDocument } from "../models/workoutModel";
import { IWorkoutRepository } from "../interfaces/IWorkoutRepository";
import { WorkoutModel } from "../models/workoutModel";
import { WorkoutRequest } from "../../../app/programs/dto/workoutDto";
import { Types } from "mongoose";

export default class WorkoutRepository
    extends BaseRepository<Workout, WorkoutDocument>
    implements IWorkoutRepository
{
    constructor() {
        super(WorkoutModel);
    }

    toEntity(doc: WorkoutDocument): Workout {
        if (!doc) return null;

        return Workout.builder()
            .setId(doc._id)
            .setTitle(doc.title)
            .setDescription(doc.description)
            .setImagePath(doc.imagePath)
            .setCompleted(doc.completed)
            .setCreatedBy(doc.createdBy)
            .setExercises(doc.exercises)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: WorkoutRequest): Partial<WorkoutDocument> {
        if (!request) return null;

        return {
            title: request.title,
            description: request.description,
            imagePath: request.imagePath,
            completed: request.completed,
            createdBy: new Types.ObjectId(request.createdBy),
            exercises: request.exercises.map(
                (exerciseId) => new Types.ObjectId(exerciseId),
            ),
        };
    }
}
