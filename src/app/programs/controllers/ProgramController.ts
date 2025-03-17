import ProgramService from "../services/ProgramService";
import { Request, Response, NextFunction } from "express";
import { ProgramRequest } from "../dto/programDto";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export default class ProgramController {
    private programService: ProgramService;

    constructor(programService: ProgramService) {
        this.programService = programService;
    }

    public createProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const programRequest: ProgramRequest = req.body;
            const programResponse =
                await this.programService.createProgram(programRequest, null);
            return res.status(HttpStatusCode.CREATED).json(programResponse);
        } catch (error) {
            next(error);
        }
    };
}
