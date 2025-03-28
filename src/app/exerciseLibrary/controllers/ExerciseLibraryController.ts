import { Request, Response, NextFunction } from "express";
import ExerciseLibraryService from "../services/ExerciseLibraryService";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import {
    FullLibraryExerciseRequest,
    FullLibraryExerciseResponse,
} from "../dto/libraryExerciseDto";

export default class ExerciseLibraryController {
    private exerciseLibraryService: ExerciseLibraryService;

    constructor(exerciseLibraryService: ExerciseLibraryService) {
        this.exerciseLibraryService = exerciseLibraryService;
    }

    public createLibraryExercise = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const libraryExerciseRequest: FullLibraryExerciseRequest = req.body;

            const libraryExerciseResponse: FullLibraryExerciseResponse =
                await this.exerciseLibraryService.createLibraryExercise(
                    libraryExerciseRequest,
                );

            return res
                .status(HttpStatusCode.CREATED)
                .json(libraryExerciseResponse);
        } catch (error) {
            next(error);
        }
    };
}
