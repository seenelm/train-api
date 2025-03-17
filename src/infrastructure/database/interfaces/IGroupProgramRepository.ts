import { IBaseRepository } from "./IBaseRepository";
import { IGroupPrograms } from "../models/groupProgramModel";
import GroupProgram from "../entity/GroupProgram";

export interface IGroupProgramRepository
    extends IBaseRepository<GroupProgram, IGroupPrograms> {
    findByGroupId(groupId: string): Promise<GroupProgram>;
    addProgramToGroup(groupId: string, programId: string): Promise<GroupProgram>;
    removeProgramFromGroup(groupId: string, programId: string): Promise<GroupProgram>;
}