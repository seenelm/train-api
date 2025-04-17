import ProgramRepository from "../../../infrastructure/database/repositories/programs/ProgramRepository";
import { ProgramRequest, ProgramResponse } from "../dto/programDto";
import Program from "../../../infrastructure/database/entity/Program";
import { handleDatabaseError } from "../../../utils/errors";
import WeekRepository from "../../../infrastructure/database/repositories/programs/WeekRepository";
import { Types } from "mongoose";
import { WeekRequest, WeekResponse } from "../dto/weekDto";
import { APIError } from "../../../common/errors/APIError";
import { WorkoutRequest, WorkoutResponse } from "../dto/workoutDto";
import WorkoutRepository from "../../../infrastructure/database/repositories/programs/WorkoutRepository";
import { ExerciseRequest, ExerciseResponse } from "../dto/exerciseDto";
import ExerciseRepository from "../../../infrastructure/database/repositories/programs/ExerciseRepository";
import SetRepository from "../../../infrastructure/database/repositories/programs/SetRepository";
import { SetRequest, SetResponse } from "../dto/setDto";
import GroupProgramRepository from "../../../infrastructure/database/repositories/programs/GroupProgramRepository";
import mongoose from "mongoose";

export default class ProgramService {
    private programRepository: ProgramRepository;
    private weekRepository: WeekRepository;
    private workoutRepository: WorkoutRepository;
    private exerciseRepository: ExerciseRepository;
    private setRepository: SetRepository;
    private groupProgramRepository: GroupProgramRepository;

    constructor(
        programRepository: ProgramRepository,
        weekRepository: WeekRepository,
        workoutRepository: WorkoutRepository,
        exerciseRepository: ExerciseRepository,
        setRepository: SetRepository,
        groupProgramRepository: GroupProgramRepository,
    ) {
        this.programRepository = programRepository;
        this.weekRepository = weekRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.setRepository = setRepository;
        this.groupProgramRepository = groupProgramRepository;
    }

    private toResponse(program: Program): ProgramResponse {
        if (!program) return null;
        return {
            id: program.getId().toString(),
            name: program.getName(),
            description: program.getDescription(),
            category: program.getCategory(),
            imagePath: program.getImagePath(),
            createdBy: program.getCreatedBy().toString(),
            numWeeks: program.getNumWeeks(),
            weeks: program.getWeeks().map((weekId) => weekId.toString()),
            difficulty: program.getDifficulty(),
        };
    }

    public async createProgram(
        programRequest: ProgramRequest,
        groupId?: Types.ObjectId,
    ): Promise<ProgramResponse> {
        try {
            // TODO: Add transaction
            const programDoc =
                this.programRepository.toDocument(programRequest);
            const program = await this.programRepository.create(programDoc);

            let weekIds: Types.ObjectId[] = [];

            if (programRequest.numWeeks > 0) {
                const weekPromises = Array.from(
                    { length: programRequest.numWeeks },
                    async (_, index) => {
                        const weekDoc = {
                            programId: program.getId(),
                            name: `Week ${index + 1}`,
                            weekNumber: index + 1,
                            workouts: [],
                        };

                        const week = await this.weekRepository.create(weekDoc);
                        weekIds.push(week.getId());
                        return week;
                    },
                );
                await Promise.all(weekPromises);

                program.setWeeks(weekIds);
                await this.programRepository.updateOne(
                    { _id: program.getId() },
                    { weeks: weekIds },
                );
            }

            // If groupId is provided, add the program to the group's programs
            if (groupId) {
                await this.groupProgramRepository.create({
                    groupId: groupId,
                    programs: [program.getId()],
                });
            }

            return this.toResponse(program);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async updateProgram(
        programRequest: ProgramRequest,
        programId: Types.ObjectId,
    ): Promise<void> {
        try {
            // TODO: Should we check for numWeeks??
            const programDoc =
                this.programRepository.toDocument(programRequest);

            await this.programRepository.findByIdAndUpdate(
                programId,
                { $set: programDoc },
                { new: true },
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteProgram(id: Types.ObjectId): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const program = await this.programRepository.findById(id, {
                session,
            });
            if (!program) {
                throw APIError.NotFound("Program not found");
            }

            // Delete all weeks associated with the program
            const weeks = await this.weekRepository.find(
                { programId: id },
                { session },
            );
            for (const week of weeks) {
                await this.deleteWeekInProgram(week.getId());
            }

            // TODO: Fix this
            // Remove the program from any group it belongs to
            await this.groupProgramRepository.updateMany(
                { programs: id },
                { $pull: { programs: id } },
                { session },
            );

            // Finally, delete the program itself
            await this.programRepository.findByIdAndDelete(id, { session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
        }
    }

    /**
     * Get a program by its ID
     * @param programId The ID of the program to retrieve
     * @returns The program entity or null if not found
     */
    public async getProgramById(
        programId: Types.ObjectId,
    ): Promise<ProgramResponse> {
        try {
            const program = await this.programRepository.findById(programId);

            if (!program) {
                throw APIError.NotFound("Program not found");
            }

            return this.toResponse(program);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async addWeekToProgram(
        weekRequest: WeekRequest,
    ): Promise<WeekResponse> {
        try {
            // TODO: Add transaction
            // TODO: Should we update numWeeks??
            const programId = new Types.ObjectId(weekRequest.programId);
            const program = await this.programRepository.findById(programId);

            if (!program) {
                throw APIError.NotFound("Program not found");
            }

            const weekDoc = this.weekRepository.toDocument(weekRequest);
            const week = await this.weekRepository.create(weekDoc);

            await this.programRepository.updateOne(
                { _id: programId },
                { $addToSet: { weeks: week.getId() } },
                { new: true },
            );

            return this.weekRepository.toResponse(week);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async updateWeekInProgram(
        weekRequest: WeekRequest,
        weekId: Types.ObjectId,
    ): Promise<void> {
        try {
            const weekDoc = this.weekRepository.toDocument(weekRequest);
            await this.weekRepository.findByIdAndUpdate(
                weekId,
                { $set: weekDoc },
                { new: true },
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteWeekInProgram(weekId: Types.ObjectId): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const week = await this.weekRepository.findById(weekId, {
                session,
            });
            if (!week) {
                throw APIError.NotFound("Week not found");
            }

            const program = await this.programRepository.findOne(
                { weeks: weekId },
                { session },
            );

            if (!program) {
                throw APIError.NotFound("Program not found");
            }

            const workoutIds = week.getWorkouts();
            if (workoutIds && workoutIds.length > 0) {
                const workouts = await this.workoutRepository.find(
                    { _id: { $in: workoutIds } },
                    { session },
                );

                const exerciseIds = workouts.flatMap(
                    (workout) => workout.getExercises() || [],
                );

                if (exerciseIds && exerciseIds.length > 0) {
                    const exercises = await this.exerciseRepository.find(
                        { _id: { $in: exerciseIds } },
                        { session },
                    );

                    const setIds = exercises.flatMap(
                        (exercise) => exercise.getSets() || [],
                    );

                    if (setIds && setIds.length > 0) {
                        await this.setRepository.deleteMany(
                            { _id: { $in: setIds } },
                            { session },
                        );
                    }

                    await this.exerciseRepository.deleteMany(
                        { _id: { $in: exerciseIds } },
                        { session },
                    );
                }

                await this.workoutRepository.deleteMany(
                    { _id: { $in: workoutIds } },
                    { session },
                );
            }

            await this.programRepository.updateOne(
                { _id: program.getId() },
                { $pull: { weeks: weekId } },
                { new: true, session },
            );

            await this.weekRepository.findByIdAndDelete(weekId, { session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
        }
    }

    public async addWorkout(
        weekId: Types.ObjectId,
        workoutRequest: WorkoutRequest,
    ): Promise<WorkoutResponse> {
        try {
            // TODO: Add transaction
            const week = await this.weekRepository.findById(weekId);

            if (!week) {
                throw APIError.NotFound("Week not found");
            }

            const workoutDoc =
                this.workoutRepository.toDocument(workoutRequest);
            const workout = await this.workoutRepository.create(workoutDoc);

            await this.weekRepository.updateOne(
                { _id: weekId },
                { $addToSet: { workouts: workout.getId() } },
                { new: true },
            );
            return this.workoutRepository.toResponse(workout);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async updateWorkout(
        workoutRequest: WorkoutRequest,
        workoutId: Types.ObjectId,
    ): Promise<void> {
        try {
            const workoutDoc =
                this.workoutRepository.toDocument(workoutRequest);
            await this.workoutRepository.findByIdAndUpdate(
                workoutId,
                { $set: workoutDoc },
                { new: true },
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteWorkout(workoutId: Types.ObjectId): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const workout = await this.workoutRepository.findById(workoutId, {
                session,
            });
            if (!workout) {
                throw APIError.NotFound("Workout not found");
            }

            const week = await this.weekRepository.findOne(
                {
                    workouts: workoutId,
                },
                { session },
            );

            if (!week) {
                throw APIError.NotFound("Week not found");
            }

            const exerciseIds = workout.getExercises();
            if (exerciseIds && exerciseIds.length > 0) {
                const exercises = await this.exerciseRepository.find(
                    {
                        _id: { $in: exerciseIds },
                    },
                    { session },
                );

                const setIds = exercises.flatMap(
                    (exercise) => exercise.getSets() || [],
                );

                if (setIds && setIds.length > 0) {
                    await this.setRepository.deleteMany(
                        { _id: { $in: setIds } },
                        { session },
                    );
                }

                await this.exerciseRepository.deleteMany(
                    { _id: { $in: exerciseIds } },
                    { session },
                );
            }

            await this.weekRepository.updateOne(
                { _id: week.getId() },
                { $pull: { workouts: workoutId } },
                { new: true, session },
            );

            await this.workoutRepository.findByIdAndDelete(workoutId, {
                session,
            });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
        }
    }

    public async addExerciseToWorkout(
        workoutId: Types.ObjectId,
        exerciseRequest: ExerciseRequest,
    ): Promise<ExerciseResponse> {
        try {
            // TODO: Add transaction
            const workout = await this.workoutRepository.findById(workoutId);

            if (!workout) {
                throw APIError.NotFound("Workout not found");
            }

            const exerciseDoc =
                this.exerciseRepository.toDocument(exerciseRequest);
            const exercise = await this.exerciseRepository.create(exerciseDoc);

            await this.workoutRepository.updateOne(
                { _id: workoutId },
                { $addToSet: { exercises: exercise.getId() } },
                { new: true },
            );
            return this.exerciseRepository.toResponse(exercise);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async updateExerciseInWorkout(
        exerciseRequest: ExerciseRequest,
        exerciseId: Types.ObjectId,
    ): Promise<void> {
        try {
            const exerciseDoc =
                this.exerciseRepository.toDocument(exerciseRequest);
            await this.exerciseRepository.findByIdAndUpdate(
                exerciseId,
                { $set: exerciseDoc },
                { new: true },
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteExerciseInWorkout(
        exerciseId: Types.ObjectId,
    ): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const exercise = await this.exerciseRepository.findById(
                exerciseId,
                { session },
            );
            if (!exercise) {
                throw APIError.NotFound("Exercise not found");
            }

            const workout = await this.workoutRepository.findOne(
                { exercises: exerciseId },
                { session },
            );

            if (!workout) {
                throw APIError.NotFound("Workout not found");
            }

            const setIds = exercise.getSets();
            if (setIds && setIds.length > 0) {
                await this.setRepository.deleteMany(
                    { _id: { $in: setIds } },
                    { session },
                );
            }

            await this.workoutRepository.updateOne(
                { _id: workout.getId() },
                { $pull: { exercises: exerciseId } },
                { new: true, session },
            );

            await this.exerciseRepository.findByIdAndDelete(exerciseId, {
                session,
            });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
        }
    }

    public async addSetToExercise(
        exerciseId: Types.ObjectId,
        setRequest: SetRequest,
    ): Promise<SetResponse> {
        try {
            // TODO: Add transaction
            const exercise = await this.exerciseRepository.findById(exerciseId);

            if (!exercise) {
                throw APIError.NotFound("Exercise not found");
            }

            const setDoc = this.setRepository.toDocument(setRequest);
            const set = await this.setRepository.create(setDoc);

            await this.exerciseRepository.updateOne(
                { _id: exerciseId },
                { $addToSet: { sets: set.getId() } },
                { new: true },
            );
            return this.setRepository.toResponse(set);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async updateSetInExercise(
        setRequest: SetRequest,
        setId: Types.ObjectId,
    ): Promise<void> {
        try {
            const setDoc = this.setRepository.toDocument(setRequest);
            await this.setRepository.findByIdAndUpdate(
                setId,
                { $set: setDoc },
                { new: true },
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteSetInExercise(setId: Types.ObjectId): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const set = await this.setRepository.findById(setId, { session });
            if (!set) {
                throw APIError.NotFound("Set not found");
            }

            const exercise = await this.exerciseRepository.findOne(
                {
                    sets: setId,
                },
                { session },
            );

            if (!exercise) {
                throw APIError.NotFound("Exercise not found");
            }

            await this.exerciseRepository.updateOne(
                { _id: exercise.getId() },
                { $pull: { sets: setId } },
                { new: true, session },
            );

            await this.setRepository.findByIdAndDelete(setId, { session });
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
        }
    }
}
