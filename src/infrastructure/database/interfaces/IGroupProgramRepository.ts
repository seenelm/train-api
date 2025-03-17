import { IBaseRepository } from "./IBaseRepository";
import { IGroupPrograms } from "../models/groupProgramModel";
import GroupProgram from "../entity/GroupProgram";
import { Types } from "mongoose";
import { DetailedGroupProgramsResponse } from "../../../app/groups/dto/groupProgramDto";

export interface IGroupProgramRepository
    extends IBaseRepository<GroupProgram, IGroupPrograms> {
    addProgramToGroup(groupId: string, programId: string): Promise<GroupProgram>;
    removeProgramFromGroup(groupId: string, programId: string): Promise<GroupProgram>;
    findGroupPrograms(groupId: Types.ObjectId): Promise<DetailedGroupProgramsResponse[]>;
}