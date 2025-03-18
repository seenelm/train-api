import BaseRepository from "./BaseRepository";
import {
    GroupProgramsModel,
    IGroupPrograms,
} from "../models/groupProgramModel";
import { IGroupProgramRepository } from "../interfaces/IGroupProgramRepository";
import GroupProgram from "../entity/GroupProgram";
import { Types, Model } from "mongoose";
import {
    GroupProgramsRequest,
    DetailedGroupProgramsResponse,
} from "../../../app/groups/dto/groupProgramDto";

export default class GroupProgramRepository
    extends BaseRepository<GroupProgram, IGroupPrograms>
    implements IGroupProgramRepository
{
    private groupPrograms: Model<IGroupPrograms>;
    constructor(groupPrograms: Model<IGroupPrograms>) {
        super(groupPrograms);
        this.groupPrograms = groupPrograms;
    }

    toEntity(doc: IGroupPrograms): GroupProgram {
        if (!doc) return null;

        return GroupProgram.builder()
            .setId(doc._id)
            .setGroupId(doc.groupId)
            .setPrograms(doc.programs)
            .build();
    }

    toDocument(request: GroupProgramsRequest): Partial<IGroupPrograms> {
        if (!request) return null;

        return {
            groupId: new Types.ObjectId(request.groupId),
            programs: request.programs.map((id) => new Types.ObjectId(id)),
        };
    }

    public async findGroupPrograms(
        groupId: Types.ObjectId,
    ): Promise<DetailedGroupProgramsResponse[]> {
        const groupPrograms = await this.groupPrograms
            .aggregate([
                {
                    $match: {
                        groupId,
                    },
                },
                {
                    $lookup: {
                        from: "programs",
                        localField: "programs",
                        foreignField: "_id",
                        as: "programs",
                    },
                },
                {
                    $unwind: "$programs",
                },
                {
                    $replaceRoot: { newRoot: "$programs" },
                },
                {
                    $lookup: {
                        from: "weeks",
                        localField: "weeks",
                        foreignField: "_id",
                        as: "weeks",
                    },
                },
                {
                    $unwind: {
                        path: "$weeks",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "workouts",
                        localField: "weeks.workouts",
                        foreignField: "_id",
                        as: "weeks.workouts",
                    },
                },
                {
                    $unwind: {
                        path: "$weeks.workouts",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "exercises",
                        localField: "weeks.workouts.exercises",
                        foreignField: "_id",
                        as: "weeks.workouts.exercises",
                    },
                },
                {
                    $unwind: {
                        path: "$weeks.workouts.exercises",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "sets",
                        localField: "weeks.workouts.exercises.sets",
                        foreignField: "_id",
                        as: "weeks.workouts.exercises.sets",
                    },
                },
                // Group sets back into exercises, exercises into workouts, workouts into weeks, and weeks into programs
                {
                    $group: {
                        _id: {
                            programId: "$_id",
                            weekId: "$weeks._id",
                            workoutId: "$weeks.workouts._id",
                            exerciseId: "$weeks.workouts.exercises._id",
                        },
                        programName: { $first: "$name" },
                        programDescription: { $first: "$description" },
                        programCreatedAt: { $first: "$createdAt" },
                        programUpdatedAt: { $first: "$updatedAt" },
                        weekName: { $first: "$weeks.name" },
                        weekNumber: { $first: "$weeks.weekNumber" },
                        weekDescription: { $first: "$weeks.description" },
                        weekCreatedAt: { $first: "$weeks.createdAt" },
                        weekUpdatedAt: { $first: "$weeks.updatedAt" },
                        workoutName: { $first: "$weeks.workouts.name" },
                        workoutDescription: {
                            $first: "$weeks.workouts.description",
                        },
                        workoutCreatedAt: {
                            $first: "$weeks.workouts.createdAt",
                        },
                        workoutUpdatedAt: {
                            $first: "$weeks.workouts.updatedAt",
                        },
                        exerciseName: {
                            $first: "$weeks.workouts.exercises.name",
                        },
                        exerciseDescription: {
                            $first: "$weeks.workouts.exercises.description",
                        },
                        exerciseCreatedAt: {
                            $first: "$weeks.workouts.exercises.createdAt",
                        },
                        exerciseUpdatedAt: {
                            $first: "$weeks.workouts.exercises.updatedAt",
                        },
                        sets: { $first: "$weeks.workouts.exercises.sets" },
                    },
                },
                // Group exercises back into workouts
                {
                    $group: {
                        _id: {
                            programId: "$_id.programId",
                            weekId: "$_id.weekId",
                            workoutId: "$_id.workoutId",
                        },
                        programName: { $first: "$programName" },
                        programDescription: { $first: "$programDescription" },
                        programCreatedAt: { $first: "$programCreatedAt" },
                        programUpdatedAt: { $first: "$programUpdatedAt" },
                        weekName: { $first: "$weekName" },
                        weekNumber: { $first: "$weekNumber" },
                        weekDescription: { $first: "$weekDescription" },
                        weekCreatedAt: { $first: "$weekCreatedAt" },
                        weekUpdatedAt: { $first: "$weekUpdatedAt" },
                        workoutName: { $first: "$workoutName" },
                        workoutDescription: { $first: "$workoutDescription" },
                        workoutCreatedAt: { $first: "$workoutCreatedAt" },
                        workoutUpdatedAt: { $first: "$workoutUpdatedAt" },
                        exercises: {
                            $push: {
                                _id: "$_id.exerciseId",
                                name: "$exerciseName",
                                description: "$exerciseDescription",
                                createdAt: "$exerciseCreatedAt",
                                updatedAt: "$exerciseUpdatedAt",
                                sets: "$sets",
                            },
                        },
                    },
                },
                // Group workouts back into weeks
                {
                    $group: {
                        _id: {
                            programId: "$_id.programId",
                            weekId: "$_id.weekId",
                        },
                        programName: { $first: "$programName" },
                        programDescription: { $first: "$programDescription" },
                        programCreatedAt: { $first: "$programCreatedAt" },
                        programUpdatedAt: { $first: "$programUpdatedAt" },
                        weekName: { $first: "$weekName" },
                        weekNumber: { $first: "$weekNumber" },
                        weekDescription: { $first: "$weekDescription" },
                        weekCreatedAt: { $first: "$weekCreatedAt" },
                        weekUpdatedAt: { $first: "$weekUpdatedAt" },
                        workouts: {
                            $push: {
                                _id: "$_id.workoutId",
                                name: "$workoutName",
                                description: "$workoutDescription",
                                createdAt: "$workoutCreatedAt",
                                updatedAt: "$workoutUpdatedAt",
                                exercises: "$exercises",
                            },
                        },
                    },
                },
                // Group weeks back into programs
                {
                    $group: {
                        _id: "$_id.programId",
                        name: { $first: "$programName" },
                        description: { $first: "$programDescription" },
                        createdAt: { $first: "$programCreatedAt" },
                        updatedAt: { $first: "$programUpdatedAt" },
                        weeks: {
                            $push: {
                                _id: "$_id.weekId",
                                name: "$weekName",
                                weekNumber: "$weekNumber",
                                description: "$weekDescription",
                                createdAt: "$weekCreatedAt",
                                updatedAt: "$weekUpdatedAt",
                                workouts: "$workouts",
                            },
                        },
                    },
                },
                // Sort weeks by weekNumber
                {
                    $addFields: {
                        weeks: {
                            $sortArray: {
                                input: "$weeks",
                                sortBy: { weekNumber: 1 },
                            },
                        },
                    },
                },
            ])
            .exec();

        console.log("Group Programs: ", groupPrograms);

        return groupPrograms;
    }

    async addProgramToGroup(
        groupId: string,
        programId: string,
    ): Promise<GroupProgram> {
        const groupObjectId = new Types.ObjectId(groupId);
        const programObjectId = new Types.ObjectId(programId);

        // Find or create group programs document
        let groupProgram = await this.findOne({ groupId: groupObjectId });

        if (!groupProgram) {
            return this.create({
                groupId: groupObjectId,
                programs: [programObjectId],
            });
        }

        // Check if program already exists in group
        const programs = groupProgram.getPrograms();

        if (!programs.some((id) => id.equals(programObjectId))) {
            programs.push(programObjectId);
            await this.updateOne(
                { _id: groupProgram.getId() },
                { programs: programs },
            );

            // Refresh the entity
            return this.findById(groupProgram.getId());
        }

        return groupProgram;
    }

    async removeProgramFromGroup(
        groupId: string,
        programId: string,
    ): Promise<GroupProgram> {
        const groupObjectId = new Types.ObjectId(groupId);
        const programObjectId = new Types.ObjectId(programId);

        const groupProgram = await this.findOne({ groupId: groupObjectId });

        if (!groupProgram) {
            return null;
        }

        const programs = groupProgram.getPrograms();
        const updatedPrograms = programs.filter(
            (id) => !id.equals(programObjectId),
        );

        await this.updateOne(
            { _id: groupProgram.getId() },
            { programs: updatedPrograms },
        );

        // Refresh the entity
        return this.findById(groupProgram.getId());
    }
}
