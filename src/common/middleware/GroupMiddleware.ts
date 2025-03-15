import { Request, Response, NextFunction } from "express";
import GroupDAO from "../../dao/GroupDAO";
import { ProgramRequest } from "../../app/programs/dto/programDto";
import { Types } from "mongoose";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { APIError } from "../errors/APIError";

export default class GroupMiddleware {
    constructor(private groupDAO: GroupDAO) {}

    validateCreateProgram = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        // TODO: Validate the request body
        const programRequest: ProgramRequest = req.body;
        const groupId: Types.ObjectId = new Types.ObjectId(req.params.groupId);

        const group = await this.groupDAO.findById(groupId);
        if (!group) {
            throw APIError.NotFound("Group not found.");
        }

        const isAdmin = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(programRequest.createdBy),
        );

        if (!isAdmin) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json({ message: "Only group admins can create programs." });
        }

        next();
    };
}
