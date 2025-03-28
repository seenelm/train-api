import { Request, Response, NextFunction } from "express";
import ExerciseLibraryService from "../services/ExerciseLibraryService";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import {
    FullLibraryExerciseRequest,
    FullLibraryExerciseResponse,
} from "../dto/libraryExerciseDto";
import { Types } from "mongoose";

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
            const fullLibraryExerciseRequest: FullLibraryExerciseRequest =
                req.body;

            const fullLibraryExerciseResponse: FullLibraryExerciseResponse =
                await this.exerciseLibraryService.createLibraryExercise(
                    fullLibraryExerciseRequest,
                );

            return res
                .status(HttpStatusCode.CREATED)
                .json(fullLibraryExerciseResponse);
        } catch (error) {
            next(error);
        }
    };
}
