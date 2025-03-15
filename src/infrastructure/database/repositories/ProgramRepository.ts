import BaseRepository from "./BaseRepository";
import { IProgramRepository } from "../interfaces/IProgramRepository";
import Program from "../entity/Program";
import { ProgramModel, ProgramDocument } from "../models/programModel";
import { ProgramRequest } from "../../../app/programs/dto/programDto";
import { Types } from "mongoose";

export default class ProgramRepository
    extends BaseRepository<Program, ProgramDocument>
    implements IProgramRepository
{
    constructor() {
        super(ProgramModel);
    }

    toEntity(doc: ProgramDocument): Program {
        if (!doc) return null;

        return Program.builder()
            .setId(doc._id)
            .setName(doc.name)
            .setDescription(doc.description)
            .setCategory(doc.category)
            .setImagePath(doc.imagePath)
            .setCreatedBy(doc.createdBy)
            .setWeeks(doc.weeks)
            .setDifficulty(doc.difficulty)
            .setNumWeeks(doc.numWeeks)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: ProgramRequest): Partial<ProgramDocument> {
        if (!request) return null;

        return {
            name: request.name,
            description: request.description,
            category: request.category,
            imagePath: request.imagePath,
            createdBy: new Types.ObjectId(request.createdBy),
            numWeeks: request.numWeeks,
            weeks: request.weeks.map((weekId) => new Types.ObjectId(weekId)),
            difficulty: request.difficulty,
        };
    }
}
