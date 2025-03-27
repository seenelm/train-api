import LibraryExerciseRepository from "../../../infrastructure/database/repositories/exerciseLibrary/LibraryExerciseRepository";
import CategoryRepository from "../../../infrastructure/database/repositories/exerciseLibrary/CategoryRepository";
import MuscleRepository from "../../../infrastructure/database/repositories/exerciseLibrary/MuscleRepository";
import {
    FullLibraryExerciseRequest,
    LibaryExerciseRequest,
    CategoryRequest,
    MuscleRequest,
} from "../dto/libraryExerciseDto";
import { APIError } from "../../../common/errors/APIError";
import Muscle from "../entity/Muscle";
import Category from "../entity/Category";

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

    async createLibraryExercise(
        request: FullLibraryExerciseRequest,
    ): Promise<void> {
        const { libraryExerciseRequest, categoryRequest, muscleRequest } =
            request;

        const category: Category = await this.categoryRepository.findOne({
            name: categoryRequest.name,
        });

        if (category) {
            throw APIError.Conflict(
                `Category with name ${categoryRequest.name} already exists`,
            );
        }

        const categoryDoc = this.categoryRepository.toDocument(categoryRequest);
        const categoryEntity: Category =
            await this.categoryRepository.create(categoryDoc);

        const muscles: Muscle[] = await this.muscleRepository.find({
            name: { $in: muscleRequest.map((m) => m.name) },
        });
    }
}
