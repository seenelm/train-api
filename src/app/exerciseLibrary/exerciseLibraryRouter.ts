import express from "express";
const exerciseLibraryRouter = express.Router();
import ExerciseLibraryController from "./controllers/ExerciseLibraryController";
import ExerciseLibraryService from "./services/ExerciseLibraryService";
import LibraryExerciseRepository from "../../infrastructure/database/repositories/exerciseLibrary/LibraryExerciseRepository";
import CategoryRepository from "../../infrastructure/database/repositories/exerciseLibrary/CategoryRepository";
import MuscleRepository from "../../infrastructure/database/repositories/exerciseLibrary/MuscleRepository";
import { LibraryExerciseModel } from "../../infrastructure/database/models/exerciseLibrary/libraryExerciseModel";
import { CategoryModel } from "../../infrastructure/database/models/exerciseLibrary/categoryModel";
import { MuscleModel } from "../../infrastructure/database/models/exerciseLibrary/muscleModel";
import { authenticate } from "../../middleware/authenticate";
import { ExerciseMusclesModel } from "../../infrastructure/database/models/exerciseLibrary/exerciseMusclesModel";
import ExerciseMusclesRepository from "../../infrastructure/database/repositories/exerciseLibrary/ExerciseMusclesRepository";

const libraryExerciseRepository = new LibraryExerciseRepository(
    LibraryExerciseModel,
);
const categoryRepository = new CategoryRepository(CategoryModel);
const muscleRepository = new MuscleRepository(MuscleModel);
const exerciseMusclesRepository = new ExerciseMusclesRepository(
    ExerciseMusclesModel,
);

const exerciseLibraryService = new ExerciseLibraryService(
    libraryExerciseRepository,
    categoryRepository,
    muscleRepository,
    exerciseMusclesRepository,
);

const exerciseLibraryController = new ExerciseLibraryController(
    exerciseLibraryService,
);

exerciseLibraryRouter.post(
    "/",
    // authenticate,
    exerciseLibraryController.createLibraryExercise,
);

export default exerciseLibraryRouter;
