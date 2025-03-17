import { Types } from "mongoose";
import GroupProgramRepository from "../../../infrastructure/database/repositories/GroupProgramRepository";
import GroupProgram from "../../../infrastructure/database/entity/GroupProgram";
import { APIError } from "../../../common/errors/APIError";

export default class GroupProgramService {
  private groupProgramRepository: GroupProgramRepository;
  
  constructor(groupProgramRepository: GroupProgramRepository) {
    this.groupProgramRepository = groupProgramRepository;
  }
  
  async getGroupPrograms(groupId: string): Promise<GroupProgram> {
    try {
      const groupProgram = await this.groupProgramRepository.findByGroupId(groupId);
      
      if (!groupProgram) {
        // Create a new GroupProgram entity if none exists
        return await this.groupProgramRepository.create({
          groupId: new Types.ObjectId(groupId),
          programs: []
        });
      }
      
      return groupProgram;
    } catch (error) {
      console.error("Error getting group programs:", error);
      // throw new APIError("Failed to get group programs", 500);
    }
  }
  
  async addProgramToGroup(groupId: string, programId: string): Promise<GroupProgram> {
    try {
      return await this.groupProgramRepository.addProgramToGroup(groupId, programId);
    } catch (error) {
      console.error("Error adding program to group:", error);
      // throw new APIError("Failed to add program to group", 500);
    }
  }
  
  async removeProgramFromGroup(groupId: string, programId: string): Promise<GroupProgram> {
    try {
      return await this.groupProgramRepository.removeProgramFromGroup(groupId, programId);
    } catch (error) {
      console.error("Error removing program from group:", error);
      // throw new APIError("Failed to remove program from group", 500);
    }
  }
}