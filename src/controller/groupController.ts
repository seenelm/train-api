import { Request, Response, NextFunction } from "express";
import GroupService from "../service/GroupService";
import { Types } from "mongoose";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import ProgramService from "../app/programs/services/ProgramService";
import { ProgramRequest } from "../app/programs/dto/programDto";
import { WeekRequest } from "../app/programs/dto/weekDto";

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
        const programRequest: ProgramRequest = req.body;

        try {
            const programResponse =
                await this.programService.createProgram(programRequest);
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
}
