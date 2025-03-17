import { Types } from "mongoose";
import GroupProgramRepository from "../../../infrastructure/database/repositories/GroupProgramRepository";
import { IGroupPrograms } from "../../../infrastructure/database/models/groupProgramModel";
import { APIError } from "../../../common/errors/APIError";

export default class GroupProgramService {
  private groupProgramRepository: GroupProgramRepository;
  
  constructor(groupProgramRepository: GroupProgramRepository) {
    this.groupProgramRepository = groupProgramRepository;
  }
  
  async getGroupPrograms(groupId: string): Promise<IGroupPrograms> {
    try {
      const groupPrograms = await this.groupProgramRepository.findByGroupId(groupId);
      
      if (!groupPrograms) {
        return {
          groupId: new Types.ObjectId(groupId),
          programs: []
        } as IGroupPrograms;
      }
      
      return groupPrograms;
    } catch (error) {
      console.error("Error getting group programs:", error);
    //   throw new APIError("Failed to get group programs", 500);
    }
  }
  
  async addProgramToGroup(groupId: string, programId: string): Promise<IGroupPrograms> {
    try {
      return await this.groupProgramRepository.addProgramToGroup(groupId, programId);
    } catch (error) {
      console.error("Error adding program to group:", error);
    //   throw new APIError("Failed to add program to group", 500);
    }
  }
  
  async removeProgramFromGroup(groupId: string, programId: string): Promise<IGroupPrograms> {
    try {
      return await this.groupProgramRepository.removeProgramFromGroup(groupId, programId);
    } catch (error) {
      console.error("Error removing program from group:", error);
    //   throw new APIError("Failed to remove program from group", 500);
    }
  }
}