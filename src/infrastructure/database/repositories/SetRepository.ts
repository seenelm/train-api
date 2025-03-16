import BaseRepository from "./BaseRepository";
import Set from "../entity/Set";
import { SetDocument } from "../models/setModel";
import { ISetRepository } from "../interfaces/ISetRepository";
import { SetModel } from "../models/setModel";
import { SetRequest } from "../../../app/programs/dto/setDto";
import { Types } from "mongoose";

export default class SetRepository
    extends BaseRepository<Set, SetDocument>
    implements ISetRepository
{
    constructor() {
        super(SetModel);
    }

    toEntity(doc: SetDocument): Set {
        if (!doc) return null;

        return Set.builder()
            .setId(doc._id)
            .setWeight(doc.weight)
            .setReps(doc.reps)
            .setCompleted(doc.completed)
            .setImagePath(doc.imagePath)
            .setLink(doc.link)
            .setCreatedBy(doc.createdBy)
            .setCreatedAt(doc.createdAt)
            .setUpdatedAt(doc.updatedAt)
            .build();
    }

    toDocument(request: SetRequest): Partial<SetDocument> {
        if (!request) return null;

        return {
            weight: request.weight,
            reps: request.reps,
            completed: request.completed,
            imagePath: request.imagePath,
            link: request.link,
            createdBy: new Types.ObjectId(request.createdBy),
        };
    }
}
