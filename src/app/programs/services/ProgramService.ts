import ProgramRepository from "../../../infrastructure/database/repositories/ProgramRepository";
import { ProgramRequest, ProgramResponse } from "../dto/programDto";
import Program from "../../../infrastructure/database/entity/Program";
import { handleDatabaseError } from "../../../utils/errors";
import WeekRepository from "../../../infrastructure/database/repositories/WeekRepository";
import { Types } from "mongoose";
import { WeekRequest, WeekResponse } from "../dto/weekDto";
import { APIError } from "../../../common/errors/APIError";

export default class ProgramService {
    private programRepository: ProgramRepository;
    private weekRepository: WeekRepository;

    constructor(
        programRepository: ProgramRepository,
        weekRepository: WeekRepository,
    ) {
        this.programRepository = programRepository;
        this.weekRepository = weekRepository;
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
                await this.programRepository.updateOne(program.getId(), {
                    weeks: weekIds,
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
                programDoc,
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    public async deleteProgramById(id: Types.ObjectId): Promise<void> {}

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
            await this.weekRepository.findByIdAndUpdate(weekId, weekDoc);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }
}
