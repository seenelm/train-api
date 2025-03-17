import BaseRepository from "./BaseRepository";
import { GroupProgramsModel, IGroupPrograms } from "../models/groupProgramModel";
import { IGroupProgramRepository } from "../interfaces/IGroupProgramRepository";
import GroupProgram from "../entity/GroupProgram";
import { Types } from "mongoose";
import { GroupProgramsRequest } from "../../../app/groups/dto/groupProgramDto";

export default class GroupProgramRepository 
  extends BaseRepository<GroupProgram, IGroupPrograms>
  implements IGroupProgramRepository 
{
  constructor() {
    super(GroupProgramsModel);
  }

  toEntity(doc: IGroupPrograms): GroupProgram {
    if (!doc) return null;
    
    return GroupProgram.builder()
      .setId(doc._id)
      .setGroupId(doc.groupId)
      .setPrograms(doc.programs)
      .build();
  }

  toDocument(request: GroupProgramsRequest): Partial<IGroupPrograms> {
    if (!request) return null;

    return {
      groupId: new Types.ObjectId(request.groupId),
      programs: request.programs.map(id => new Types.ObjectId(id))
    };
  }

  async findByGroupId(groupId: string): Promise<GroupProgram> {
    const groupObjectId = new Types.ObjectId(groupId);
    return this.findOne({ groupId: groupObjectId });
  }

  async addProgramToGroup(groupId: string, programId: string): Promise<GroupProgram> {
    const groupObjectId = new Types.ObjectId(groupId);
    const programObjectId = new Types.ObjectId(programId);
    
    // Find or create group programs document
    let groupProgram = await this.findOne({ groupId: groupObjectId });
    
    if (!groupProgram) {
      return this.create({
        groupId: groupObjectId,
        programs: [programObjectId]
      });
    }
    
    // Check if program already exists in group
    const programs = groupProgram.getPrograms();
    
    if (!programs.some(id => id.equals(programObjectId))) {
      programs.push(programObjectId);
      await this.updateOne(
        { _id: groupProgram.getId() },
        { programs: programs }
      );
      
      // Refresh the entity
      return this.findById(groupProgram.getId());
    }
    
    return groupProgram;
  }

  async removeProgramFromGroup(groupId: string, programId: string): Promise<GroupProgram> {
    const groupObjectId = new Types.ObjectId(groupId);
    const programObjectId = new Types.ObjectId(programId);
    
    const groupProgram = await this.findOne({ groupId: groupObjectId });
    
    if (!groupProgram) {
      return null;
    }
    
    const programs = groupProgram.getPrograms();
    const updatedPrograms = programs.filter(id => !id.equals(programObjectId));
    
    await this.updateOne(
      { _id: groupProgram.getId() },
      { programs: updatedPrograms }
    );
    
    // Refresh the entity
    return this.findById(groupProgram.getId());
  }
}