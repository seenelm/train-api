import BaseRepository from "../BaseRepository";
import Week from "../../entity/Week";
import { WeekDocument } from "../../models/weekModel";
import { IWeekRepository } from "../../interfaces/IWeekRepository";
import { WeekModel } from "../../models/weekModel";
import {
    WeekRequest,
    WeekResponse,
} from "../../../../app/programs/dto/weekDto";
import { Types } from "mongoose";

export default class WeekRepository
    extends BaseRepository<Week, WeekDocument>
    implements IWeekRepository
{
    constructor() {
        super(WeekModel);
    }

    toEntity(doc: WeekDocument): Week {
        if (!doc) return null;

        return Week.builder()
            .setId(doc._id)
            .setProgramId(doc.programId)
            .setName(doc.name)
            .setDescription(doc.description)
            .setImagePath(doc.imagePath)
            .setWeekNumber(doc.weekNumber)
            .setWorkouts(doc.workouts)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: WeekRequest): Partial<WeekDocument> {
        if (!request) return null;

        return {
            programId: new Types.ObjectId(request.programId),
            name: request.name,
            description: request.description,
            imagePath: request.imagePath,
            weekNumber: request.weekNumber,
            workouts: request.workouts.map(
                (workoutId) => new Types.ObjectId(workoutId),
            ),
        };
    }

    toResponse(week: Week): WeekResponse {
        if (!week) return null;

        return {
            id: week.getId().toString(),
            programId: week.getProgramId().toString(),
            name: week.getName(),
            description: week.getDescription(),
            imagePath: week.getImagePath(),
            weekNumber: week.getWeekNumber(),
            workouts: week
                .getWorkouts()
                .map((workoutId) => workoutId.toString()),
        };
    }
}
