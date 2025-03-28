import LibraryExerciseRepository from "../../../infrastructure/database/repositories/exerciseLibrary/LibraryExerciseRepository";
import CategoryRepository from "../../../infrastructure/database/repositories/exerciseLibrary/CategoryRepository";
import MuscleRepository from "../../../infrastructure/database/repositories/exerciseLibrary/MuscleRepository";
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
} from "../dto/libraryExerciseDto";
import { APIError } from "../../../common/errors/APIError";
import Muscle from "../entity/Muscle";
import Category from "../entity/Category";
import LibraryExercise from "../entity/LibraryExercise";
import { Types } from "mongoose";
import { handleDatabaseError } from "../../../utils/errors";

export default class ExerciseLibraryService {
    private libraryExerciseRepository: LibraryExerciseRepository;
    private categoryRepository: CategoryRepository;
    private muscleRepository: MuscleRepository;

    constructor(
        libraryExerciseRepository: LibraryExerciseRepository,
        categoryRepository: CategoryRepository,
        muscleRepository: MuscleRepository,
    ) {
        this.libraryExerciseRepository = libraryExerciseRepository;
        this.categoryRepository = categoryRepository;
        this.muscleRepository = muscleRepository;
    }

    public async createLibraryExercise(
        request: FullLibraryExerciseRequest,
    ): Promise<FullLibraryExerciseResponse> {
        const { libraryExerciseRequest, categoryRequest, muscleRequest } =
            request;

        let categoryResponse: CategoryResponse = null;
        let libraryExerciseResponse: LibraryExerciseResponse = null;
        let muscles: MuscleResponse[] = [];

        try {
            const category: Category = await this.categoryRepository.findOne({
                name: categoryRequest.name,
            });

            // Create category if it doesn't exist
            if (!category) {
                const categoryDoc =
                    this.categoryRepository.toDocument(categoryRequest);
                const categoryEntity: Category =
                    await this.categoryRepository.create(categoryDoc);
                categoryResponse =
                    this.categoryRepository.toResponse(categoryEntity);

                libraryExerciseRequest.categoryId = categoryEntity.getId();
                const libraryExerciseDoc =
                    this.libraryExerciseRepository.toDocument(
                        libraryExerciseRequest,
                    );
                const libraryExercise: LibraryExercise =
                    await this.libraryExerciseRepository.create(
                        libraryExerciseDoc,
                    );
                libraryExerciseResponse =
                    this.libraryExerciseRepository.toResponse(libraryExercise);
            }

            // Use existing category if it exists
            // categoryResponse = this.categoryRepository.toResponse(category);

            // libraryExerciseRequest.categoryId = category.getId();
            // const libraryExerciseDoc =
            //     this.libraryExerciseRepository.toDocument(
            //         libraryExerciseRequest,
            //     );
            // const libraryExercise: LibraryExercise =
            //     await this.libraryExerciseRepository.create(libraryExerciseDoc);
            // libraryExerciseResponse =
            //     this.libraryExerciseRepository.toResponse(libraryExercise);

            for (const muscle of muscleRequest) {
                const existingMuscle = await this.muscleRepository.findOne({
                    name: muscle.name,
                });
                if (!existingMuscle) {
                    const muscleDoc = this.muscleRepository.toDocument(muscle);
                    const muscleEntity: Muscle =
                        await this.muscleRepository.create(muscleDoc);

                    const muscleResponse: MuscleResponse =
                        this.muscleRepository.toResponse(muscleEntity);
                    muscles.push(muscleResponse);
                }
                // const muscleResponse: MuscleResponse =
                //     this.muscleRepository.toResponse(existingMuscle);
                // muscles.push(muscleResponse);
            }

            return toFullLibraryExerciseResponse(
                libraryExerciseResponse,
                categoryResponse,
                muscles,
            );
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }
}
