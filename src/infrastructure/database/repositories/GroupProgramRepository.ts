import BaseRepository from "./BaseRepository";
import { GroupProgramsModel, IGroupPrograms } from "../models/groupProgramModel";
import { Types } from "mongoose";

export interface IGroupProgramRepository {
  findByGroupId(groupId: string): Promise<IGroupPrograms>;
  addProgramToGroup(groupId: string, programId: string): Promise<IGroupPrograms>;
  removeProgramFromGroup(groupId: string, programId: string): Promise<IGroupPrograms>;
}

export default class GroupProgramRepository 
  extends BaseRepository<IGroupPrograms, IGroupPrograms>
  implements IGroupProgramRepository 
{
  constructor() {
    super(GroupProgramsModel);
  }

  toEntity(doc: IGroupPrograms): IGroupPrograms {
    if (!doc) return null;
    return doc;
  }

  async findByGroupId(groupId: string): Promise<IGroupPrograms> {
    const groupObjectId = new Types.ObjectId(groupId);
    return this.findOne({ groupId: groupObjectId });
  }

  async addProgramToGroup(groupId: string, programId: string): Promise<IGroupPrograms> {
    const groupObjectId = new Types.ObjectId(groupId);
    const programObjectId = new Types.ObjectId(programId);
    
    // Find or create group programs document
    let groupPrograms = await this.findOne({ groupId: groupObjectId });
    
    if (!groupPrograms) {
      groupPrograms = await this.create({
        groupId: groupObjectId,
        programs: [programObjectId]
      });
      return groupPrograms;
    }
    
    // Check if program already exists in group
    if (!groupPrograms.programs.some(id => id.equals(programObjectId))) {
      groupPrograms.programs.push(programObjectId);
      await groupPrograms.save();
    }
    
    return groupPrograms;
  }

  async removeProgramFromGroup(groupId: string, programId: string): Promise<IGroupPrograms> {
    const groupObjectId = new Types.ObjectId(groupId);
    const programObjectId = new Types.ObjectId(programId);
    
    const groupPrograms = await this.findOne({ groupId: groupObjectId });
    
    if (groupPrograms) {
      groupPrograms.programs = groupPrograms.programs.filter(
        id => !id.equals(programObjectId)
      );
      await groupPrograms.save();
    }
    
    return groupPrograms;
  }
}