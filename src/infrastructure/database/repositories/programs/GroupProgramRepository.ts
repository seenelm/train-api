import BaseRepository from "../BaseRepository";
import {
    GroupProgramsModel,
    IGroupPrograms,
} from "../../models/groupProgramModel";
import { IGroupProgramRepository } from "../../interfaces/IGroupProgramRepository";
import GroupProgram from "../../entity/GroupProgram";
import { Types, Model } from "mongoose";
import {
    GroupProgramsRequest,
    DetailedGroupProgramsResponse,
} from "../../../../app/groups/dto/groupProgramDto";

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
                        programCategory: { $first: "$category" },
                        programNumWeeks: { $first: "$numWeeks" },
                        programImagePath: { $first: "$imagePath" },
                        programCreatedBy: { $first: "$createdBy" },
                        programDifficulty: { $first: "$difficulty" },
                        programCreatedAt: { $first: "$createdAt" },
                        programUpdatedAt: { $first: "$updatedAt" },
                        weekProgramId: { $first: "$weeks.programId" },
                        weekName: { $first: "$weeks.name" },
                        weekDescription: { $first: "$weeks.description" },
                        weekImagePath: { $first: "$weeks.imagePath" },
                        weekNumber: { $first: "$weeks.weekNumber" },
                        weekCreatedAt: { $first: "$weeks.createdAt" },
                        weekUpdatedAt: { $first: "$weeks.updatedAt" },
                        workoutTitle: { $first: "$weeks.workouts.title" },
                        workoutDescription: {
                            $first: "$weeks.workouts.description",
                        },
                        workoutImagePath: {
                            $first: "$weeks.workouts.imagePath",
                        },
                        workoutCompleted: {
                            $first: "$weeks.workouts.completed",
                        },
                        workoutCreatedBy: {
                            $first: "$weeks.workouts.createdBy",
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
                        exerciseGroup: {
                            $first: "$weeks.workouts.exercises.group",
                        },
                        exerciseImagePath: {
                            $first: "$weeks.workouts.exercises.imagePath",
                        },
                        exerciseWeight: {
                            $first: "$weeks.workouts.exercises.weight",
                        },
                        exerciseTargetSets: {
                            $first: "$weeks.workouts.exercises.targetSets",
                        },
                        exerciseTargetReps: {
                            $first: "$weeks.workouts.exercises.targetReps",
                        },
                        exerciseNotes: {
                            $first: "$weeks.workouts.exercises.notes",
                        },
                        exerciseCompleted: {
                            $first: "$weeks.workouts.exercises.completed",
                        },
                        exerciseCreatedBy: {
                            $first: "$weeks.workouts.exercises.createdBy",
                        },
                        exerciseCreatedAt: {
                            $first: "$weeks.workouts.exercises.createdAt",
                        },
                        exerciseUpdatedAt: {
                            $first: "$weeks.workouts.exercises.updatedAt",
                        },
                        sets: {
                            $push: {
                                _id: "$weeks.workouts.exercises.sets._id",
                                weight: "$weeks.workouts.exercises.sets.weight",
                                reps: "$weeks.workouts.exercises.sets.reps",
                                completed:
                                    "$weeks.workouts.exercises.sets.completed",
                                imagePath:
                                    "$weeks.workouts.exercises.sets.imagePath",
                                link: "$weeks.workouts.exercises.sets.link",
                                createdBy:
                                    "$weeks.workouts.exercises.sets.createdBy",
                                createdAt:
                                    "$weeks.workouts.exercises.sets.createdAt",
                                updatedAt:
                                    "$weeks.workouts.exercises.sets.updatedAt",
                            },
                        },
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
                        programName: { $first: "$name" },
                        programDescription: { $first: "$description" },
                        programCategory: { $first: "$category" },
                        programNumWeeks: { $first: "$numWeeks" },
                        programImagePath: { $first: "$imagePath" },
                        programCreatedBy: { $first: "$createdBy" },
                        programDifficulty: { $first: "$difficulty" },
                        programCreatedAt: { $first: "$createdAt" },
                        programUpdatedAt: { $first: "$updatedAt" },
                        weekProgramId: { $first: "$weeks.programId" },
                        weekName: { $first: "$weeks.name" },
                        weekDescription: { $first: "$weeks.description" },
                        weekImagePath: { $first: "$weeks.imagePath" },
                        weekNumber: { $first: "$weeks.weekNumber" },
                        weekCreatedAt: { $first: "$weeks.createdAt" },
                        weekUpdatedAt: { $first: "$weeks.updatedAt" },
                        workoutTitle: { $first: "$weeks.workouts.title" },
                        workoutDescription: {
                            $first: "$weeks.workouts.description",
                        },
                        workoutImagePath: {
                            $first: "$weeks.workouts.imagePath",
                        },
                        workoutCompleted: {
                            $first: "$weeks.workouts.completed",
                        },
                        workoutCreatedBy: {
                            $first: "$weeks.workouts.createdBy",
                        },
                        workoutCreatedAt: {
                            $first: "$weeks.workouts.createdAt",
                        },
                        workoutUpdatedAt: {
                            $first: "$weeks.workouts.updatedAt",
                        },
                        exercises: {
                            $push: {
                                _id: "$_id.exerciseId",
                                name: "$exerciseName",
                                group: "$exerciseGroup",
                                imagePath: "$exerciseImagePath",
                                weight: "$exerciseWeight",
                                targetSets: "$exerciseTargetSets",
                                targetReps: "$exerciseTargetReps",
                                notes: "$exerciseNotes",
                                completed: "$exerciseCompleted",
                                createdBy: "$exerciseCreatedBy",
                                sets: "$sets",
                                createdAt: "$exerciseCreatedAt",
                                updatedAt: "$exerciseUpdatedAt",
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
                        programName: { $first: "$name" },
                        programDescription: { $first: "$description" },
                        programCategory: { $first: "$category" },
                        programNumWeeks: { $first: "$numWeeks" },
                        programImagePath: { $first: "$imagePath" },
                        programCreatedBy: { $first: "$createdBy" },
                        programDifficulty: { $first: "$difficulty" },
                        programCreatedAt: { $first: "$createdAt" },
                        programUpdatedAt: { $first: "$updatedAt" },
                        weekProgramId: { $first: "$weeks.programId" },
                        weekName: { $first: "$weeks.name" },
                        weekDescription: { $first: "$weeks.description" },
                        weekImagePath: { $first: "$weeks.imagePath" },
                        weekNumber: { $first: "$weeks.weekNumber" },
                        weekCreatedAt: { $first: "$weeks.createdAt" },
                        weekUpdatedAt: { $first: "$weeks.updatedAt" },
                        workouts: {
                            $push: {
                                _id: "$_id.workoutId",
                                title: "$workoutTitle",
                                description: "$workoutDescription",
                                imagePath: "$workoutImagePath",
                                completed: "$workoutCompleted",
                                createdBy: "$workoutCreatedBy",
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
                        category: { $first: "$programCategory" },
                        numWeeks: { $first: "$programNumWeeks" },
                        imagePath: { $first: "$programImagePath" },
                        createdBy: { $first: "$programCreatedBy" },
                        difficulty: { $first: "$programDifficulty" },
                        createdAt: { $first: "$programCreatedAt" },
                        updatedAt: { $first: "$programUpdatedAt" },
                        weeks: {
                            $push: {
                                _id: "$_id.weekId",
                                programId: "$weekProgramId",
                                name: "$weekName",
                                description: "$weekDescription",
                                imagePath: "$weekImagePath",
                                weekNumber: "$weekNumber",
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
