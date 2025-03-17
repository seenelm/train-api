import { Request, Response, NextFunction } from "express";
import GroupService from "../service/GroupService";
import { Types } from "mongoose";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import ProgramService from "../app/programs/services/ProgramService";
import { ProgramRequest } from "../app/programs/dto/programDto";
import { WeekRequest } from "../app/programs/dto/weekDto";
import { WorkoutRequest } from "../app/programs/dto/workoutDto";
import { ExerciseRequest } from "../app/programs/dto/exerciseDto";
import { SetRequest } from "../app/programs/dto/setDto";

export default class GroupController {
    private groupService: GroupService;
    private programService: ProgramService;

    constructor(groupService: GroupService, programService: ProgramService) {
        this.groupService = groupService;
        this.programService = programService;
    }

    public addGroup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { groupName, userId } = req.body;
            const userID = new Types.ObjectId(userId);

            const group = await this.groupService.addGroup(groupName, userID);
            return res.status(HttpStatusCode.CREATED).json(group);
        } catch (error) {
            next(error);
        }
    };

    public fetchGroup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;
        let groupID = new Types.ObjectId(groupId);
        try {
            const group = await this.groupService.fetchGroup(groupID);
            return res.status(HttpStatusCode.OK).json(group);
        } catch (error) {
            next(error);
        }
    };

    public updateGroupProfile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;
        const { groupBio, groupName, accountType } = req.body;

        const ownerId = req.user.id;
        const groupID = new Types.ObjectId(groupId);

        try {
            await this.groupService.updateGroupProfile(
                ownerId,
                groupID,
                groupBio,
                groupName,
                accountType,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public joinGroup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;

        const groupID = new Types.ObjectId(groupId);
        const userId = new Types.ObjectId(req.user.id);

        try {
            await this.groupService.joinGroup(userId, groupID);
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public requestToJoinGroup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;

        const groupID = new Types.ObjectId(groupId);
        const userId = new Types.ObjectId(req.user.id);

        try {
            await this.groupService.requestToJoinGroup(userId, groupID);
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public getJoinRequests = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;
        const userId = new Types.ObjectId(req.user.id);

        const groupID = new Types.ObjectId(groupId);
        try {
            const requests = await this.groupService.getJoinRequests(
                userId,
                groupID,
            );
            return res.status(HttpStatusCode.OK).json(requests);
        } catch (error) {
            next(error);
        }
    };

    public getJoinRequestsByUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = new Types.ObjectId(req.user.id);

        try {
            const requests =
                await this.groupService.getJoinRequestsByUser(userId);
            return res.status(HttpStatusCode.OK).json(requests);
        } catch (error) {
            next(error);
        }
    };

    public createProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { groupId } = req.params;
        const programRequest: ProgramRequest = req.body;

        try {
            const programResponse =
                await this.programService.createProgram(programRequest, groupId);
            return res.status(HttpStatusCode.CREATED).json(programResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { programId } = req.params;
        const programRequest: ProgramRequest = req.body;

        try {
            await this.programService.updateProgram(
                programRequest,
                new Types.ObjectId(programId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public deleteProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { programId } = req.params;

        try {
            await this.programService.deleteProgram(
                new Types.ObjectId(programId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public addWeekToProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const weekRequest: WeekRequest = req.body;

        try {
            const weekResponse =
                await this.programService.addWeekToProgram(weekRequest);
            return res.status(HttpStatusCode.CREATED).json(weekResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateWeekInProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { weekId } = req.params;
        const weekRequest: WeekRequest = req.body;

        try {
            await this.programService.updateWeekInProgram(
                weekRequest,
                new Types.ObjectId(weekId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public deleteWeekInProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { weekId } = req.params;

        try {
            await this.programService.deleteWeekInProgram(
                new Types.ObjectId(weekId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public addWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { weekId } = req.params;
        const workoutRequest: WorkoutRequest = req.body;

        try {
            const workoutResponse = await this.programService.addWorkout(
                new Types.ObjectId(weekId),
                workoutRequest,
            );
            return res.status(HttpStatusCode.CREATED).json(workoutResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { workoutId } = req.params;
        const workoutRequest: WorkoutRequest = req.body;

        try {
            await this.programService.updateWorkout(
                workoutRequest,
                new Types.ObjectId(workoutId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public deleteWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { workoutId } = req.params;

        try {
            await this.programService.deleteWorkout(
                new Types.ObjectId(workoutId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public addExerciseToWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { workoutId } = req.params;
        const exerciseRequest: ExerciseRequest = req.body;

        try {
            const exerciseResponse =
                await this.programService.addExerciseToWorkout(
                    new Types.ObjectId(workoutId),
                    exerciseRequest,
                );
            return res.status(HttpStatusCode.CREATED).json(exerciseResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateExerciseInWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { exerciseId } = req.params;
        const exerciseRequest: ExerciseRequest = req.body;

        try {
            await this.programService.updateExerciseInWorkout(
                exerciseRequest,
                new Types.ObjectId(exerciseId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public deleteExerciseInWorkout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { exerciseId } = req.params;

        try {
            await this.programService.deleteExerciseInWorkout(
                new Types.ObjectId(exerciseId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public addSetToExercise = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { exerciseId } = req.params;
        const setRequest = req.body; // Assuming setRequest is sent in the body

        try {
            const setResponse = await this.programService.addSetToExercise(
                new Types.ObjectId(exerciseId),
                setRequest,
            );
            return res.status(HttpStatusCode.CREATED).json(setResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateSetInExercise = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { setId } = req.params;
        const setRequest: SetRequest = req.body;

        try {
            await this.programService.updateSetInExercise(
                setRequest,
                new Types.ObjectId(setId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    public deleteSetInExercise = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { setId } = req.params;

        try {
            await this.programService.deleteSetInExercise(
                new Types.ObjectId(setId),
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
