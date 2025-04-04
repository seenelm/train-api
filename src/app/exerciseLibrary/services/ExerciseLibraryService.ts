import LibraryExerciseRepository from "../../../infrastructure/database/repositories/exerciseLibrary/LibraryExerciseRepository";
import CategoryRepository from "../../../infrastructure/database/repositories/exerciseLibrary/CategoryRepository";
import MuscleRepository from "../../../infrastructure/database/repositories/exerciseLibrary/MuscleRepository";
import ExerciseMusclesRepository from "../../../infrastructure/database/repositories/exerciseLibrary/ExerciseMusclesRepository";
import {
    FullLibraryExerciseRequest,
    LibaryExerciseRequest,
    CategoryRequest,
    MuscleRequest,
    FullLibraryExerciseResponse,
    CategoryResponse,
    MuscleResponse,
    LibraryExerciseResponse,
    toFullLibraryExerciseResponse,
    ExerciseMusclesResponse,
    ExerciseMusclesRequest,
} from "../dto/libraryExerciseDto";
import { APIError } from "../../../common/errors/APIError";
import Muscle from "../entity/Muscle";
import Category from "../entity/Category";
import LibraryExercise from "../entity/LibraryExercise";
import mongoose, { Types } from "mongoose";
import { handleDatabaseError } from "../../../utils/errors";
import { ExerciseMusclesDocument } from "../../../infrastructure/database/models/exerciseLibrary/exerciseMusclesModel";
import ExerciseMuscles from "../entity/ExerciseMuscles";
import CustomLogger from "../../../common/logger";

export default class ExerciseLibraryService {
    private libraryExerciseRepository: LibraryExerciseRepository;
    private categoryRepository: CategoryRepository;
    private muscleRepository: MuscleRepository;
    private exerciseMusclesRepository: ExerciseMusclesRepository;
    private logger: CustomLogger;

    constructor(
        libraryExerciseRepository: LibraryExerciseRepository,
        categoryRepository: CategoryRepository,
        muscleRepository: MuscleRepository,
        exerciseMusclesRepository: ExerciseMusclesRepository,
    ) {
        this.libraryExerciseRepository = libraryExerciseRepository;
        this.categoryRepository = categoryRepository;
        this.muscleRepository = muscleRepository;
        this.exerciseMusclesRepository = exerciseMusclesRepository;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async createLibraryExercise(
        request: FullLibraryExerciseRequest,
    ): Promise<FullLibraryExerciseResponse> {
        const { libraryExerciseRequest, categoryRequest, muscleRequest } =
            request;
        // const session = await mongoose.startSession();

        try {
            // session.startTransaction();

            const existingLibraryExercise =
                await this.libraryExerciseRepository.findOne({
                    name: libraryExerciseRequest.name,
                });

            if (existingLibraryExercise) {
                const category = await this.categoryRepository.findById(
                    existingLibraryExercise.getCategoryId(),
                );
                if (!category) {
                    throw APIError.NotFound("Category not found");
                }
                const exerciseMusclesResponse =
                    await this.exerciseMusclesRepository.getExerciseMuscles(
                        existingLibraryExercise.getId(),
                    );

                if (!exerciseMusclesResponse) {
                    throw APIError.NotFound("Exercise muscles not found");
                }

                // await session.abortTransaction();
                // session.endSession();

                return toFullLibraryExerciseResponse(
                    this.libraryExerciseRepository.toResponse(
                        existingLibraryExercise,
                    ),
                    this.categoryRepository.toResponse(category),
                    exerciseMusclesResponse,
                );
            }

            let category: Category;

            try {
                category = await this.categoryRepository.findOne({
                    name: categoryRequest.name,
                });

                if (!category) {
                    this.logger.logInfo("Category not found, creating new", {
                        categoryName: categoryRequest.name,
                    });

                    const categoryDoc =
                        this.categoryRepository.toDocument(categoryRequest);

                    if (!categoryDoc) {
                        throw APIError.BadRequest(
                            "Failed to create category document",
                        );
                    }

                    category =
                        await this.categoryRepository.create(categoryDoc);

                    if (!category) {
                        throw APIError.InternalServerError(
                            "Failed to create category",
                        );
                    }

                    this.logger.logInfo("Category created successfully", {
                        categoryId: category.getId(),
                        categoryName: category.getName(),
                    });
                } else {
                    this.logger.logInfo("Found existing category", {
                        categoryId: category.getId(),
                        categoryName: category.getName(),
                    });
                }
            } catch (error) {
                console.error("Error finding or creating category: ", error);
                throw error;
            }
            libraryExerciseRequest.categoryId = category.getId();
            const libraryExerciseDoc =
                this.libraryExerciseRepository.toDocument(
                    libraryExerciseRequest,
                );
            const libraryExercise: LibraryExercise =
                await this.libraryExerciseRepository.create(libraryExerciseDoc);
            const libraryExerciseResponse =
                this.libraryExerciseRepository.toResponse(libraryExercise);

            await this.processMusclesForExercise(
                new Types.ObjectId(libraryExerciseResponse.id),
                muscleRequest,
            );

            const exerciseMusclesResponse =
                await this.exerciseMusclesRepository.getExerciseMuscles(
                    new Types.ObjectId(libraryExerciseResponse.id),
                );

            // await session.commitTransaction();

            const response = toFullLibraryExerciseResponse(
                libraryExerciseResponse,
                this.categoryRepository.toResponse(category),
                exerciseMusclesResponse,
            );
            console.log("Response: ", response);
            return response;
        } catch (error) {
            // await session.abortTransaction();
            throw handleDatabaseError(error);
        } finally {
            // session.endSession();
        }
    }

    private async processMusclesForExercise(
        exerciseId: Types.ObjectId,
        muscleRequests: MuscleRequest[],
        // session: mongoose.ClientSession,
    ): Promise<void> {
        const exerciseMusclesRequests: ExerciseMusclesRequest[] = [];

        try {
            for (const muscleRequest of muscleRequests) {
                let muscle = await this.muscleRepository.findOne({
                    name: muscleRequest.name,
                });
                if (!muscle) {
                    const muscleDoc =
                        this.muscleRepository.toDocument(muscleRequest);
                    muscle = await this.muscleRepository.create(muscleDoc);
                }

                const exerciseMuscleDoc = {
                    exerciseId: exerciseId,
                    muscleId: muscle.getId(),
                    primary: muscleRequest.primary,
                };
                await this.exerciseMusclesRepository.create(exerciseMuscleDoc);
            }

            // if (exerciseMusclesRequests.length > 0) {
            //     const exerciseMusclesDocs = exerciseMusclesRequests.map(
            //         (request) =>
            //             this.exerciseMusclesRepository.toDocument(request),
            //     );

            //     await this.upsertExerciseMuscles(exerciseMusclesDocs, session);
            // }
        } catch (error) {
            console.error("Error processing muscles for exercise: ", error);
            throw error;
        }
    }

    private async upsertExerciseMuscles(
        exerciseMusclesDocs: Partial<ExerciseMusclesDocument>[],
        // session: mongoose.ClientSession,
    ): Promise<ExerciseMuscles[]> {
        const promises = exerciseMusclesDocs.map(async (doc) => {
            const result =
                await this.exerciseMusclesRepository.findOneAndUpdate(
                    {
                        exerciseId: doc.exerciseId,
                        muscleId: doc.muscleId,
                    },
                    {
                        $set: {
                            primary: doc.primary,
                        },
                    },
                    { upsert: true, new: true },
                );

            return result;
        });

        return await Promise.all(promises);
    }
}
