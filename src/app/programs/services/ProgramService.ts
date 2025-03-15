import ProgramRepository from "../../../infrastructure/database/repositories/ProgramRepository";
import { ProgramRequest, ProgramResponse } from "../dto/programDto";
import Program from "../../../infrastructure/database/entity/Program";
import { handleDatabaseError } from "../../../utils/errors";
import WeekRepository from "../../../infrastructure/database/repositories/WeekRepository";
import { Types } from "mongoose";

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

    public async createProgram(programRequest: ProgramRequest) {
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
}
