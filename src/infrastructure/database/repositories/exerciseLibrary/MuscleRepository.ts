import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { MuscleDocument } from "../../models/exerciseLibrary/muscleModel";
import Muscle from "../../../../app/exerciseLibrary/entity/Muscle";
import { Model } from "mongoose";
import BaseRepository from "../BaseRepository";
import {
    MuscleRequest,
    MuscleResponse,
} from "../../../../app/exerciseLibrary/dto/libraryExerciseDto";

export interface IMuscleRepository
    extends IBaseRepository<Muscle, MuscleDocument> {}

export default class MuscleRepository
    extends BaseRepository<Muscle, MuscleDocument>
    implements IMuscleRepository
{
    private muscleModel: Model<MuscleDocument>;

    constructor(muscleModel: Model<MuscleDocument>) {
        super(muscleModel);
        this.muscleModel = muscleModel;
    }

    toEntity(doc: MuscleDocument): Muscle {
        if (!doc) return null;

        return new Muscle(doc._id, doc.name, doc.createdAt, doc.updatedAt);
    }

    toDocument(request: MuscleRequest): Partial<MuscleDocument> {
        if (!request) return null;

        return {
            name: request.name,
        };
    }

    toResponse(entity: Muscle): MuscleResponse {
        if (!entity) return null;

        return {
            id: entity.getId().toString(),
            name: entity.getName(),
        };
    }
}
