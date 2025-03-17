import ProgramRepository from "../../../infrastructure/database/repositories/ProgramRepository";
import { ProgramRequest, ProgramResponse } from "../dto/programDto";
import Program from "../../../infrastructure/database/entity/Program";
import { handleDatabaseError } from "../../../utils/errors";
import WeekRepository from "../../../infrastructure/database/repositories/WeekRepository";
import { Types } from "mongoose";
import { WeekRequest, WeekResponse } from "../dto/weekDto";
import { APIError } from "../../../common/errors/APIError";
import { WorkoutRequest, WorkoutResponse } from "../dto/workoutDto";
import WorkoutRepository from "../../../infrastructure/database/repositories/WorkoutRepository";
import { ExerciseRequest, ExerciseResponse } from "../dto/exerciseDto";
import ExerciseRepository from "../../../infrastructure/database/repositories/ExerciseRepository";
import SetRepository from "../../../infrastructure/database/repositories/SetRepository";
import { SetRequest, SetResponse } from "../dto/setDto";
import GroupProgramService from "../../groups/services/GroupProgramService";

export default class ProgramService {
    private programRepository: ProgramRepository;
    private weekRepository: WeekRepository;
    private workoutRepository: WorkoutRepository;
    private exerciseRepository: ExerciseRepository;
    private setRepository: SetRepository;
    private groupProgramService: GroupProgramService;

    constructor(
        programRepository: ProgramRepository,
        weekRepository: WeekRepository,
        workoutRepository: WorkoutRepository,
        exerciseRepository: ExerciseRepository,
        setRepository: SetRepository,
        groupProgramService: GroupProgramService,
    ) {
        this.programRepository = programRepository;
        this.weekRepository = weekRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.setRepository = setRepository;
        this.groupProgramService = groupProgramService;
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
        groupId?: string,
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
                    { weeks: weekIds }
                );
            }

            // If groupId is provided, add the program to the group's programs
            if (groupId) {
                await this.groupProgramService.addProgramToGroup(
                    groupId,
                    program.getId().toString()
                );
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

    public async deleteProgram(id: Types.ObjectId): Promise<void> {}

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

    public async deleteWeekInProgram(weekId: Types.ObjectId): Promise<void> {}

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

    public async deleteWorkout(workoutId: Types.ObjectId): Promise<void> {}

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
    ): Promise<void> {}

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

    public async deleteSetInExercise(setId: Types.ObjectId): Promise<void> {}
}
