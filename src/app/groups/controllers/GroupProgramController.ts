import { Request, Response, NextFunction } from "express";
import GroupProgramService from "../services/GroupProgramService";
import { APIError } from "../../../common/errors/APIError";

export default class GroupProgramController {
  private groupProgramService: GroupProgramService;
  
  constructor(groupProgramService: GroupProgramService) {
    this.groupProgramService = groupProgramService;
  }
  
  getGroupPrograms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupId } = req.params;
      
      if (!groupId) {
        // throw new APIError("Group ID is required", 400);
      }
      
      const groupPrograms = await this.groupProgramService.getGroupPrograms(groupId);
      
      res.status(200).json({
        success: true,
        data: groupPrograms
      });
    } catch (error) {
      next(error);
    }
  };
  
  addProgramToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupId } = req.params;
      const { programId } = req.body;
      
      if (!groupId || !programId) {
        // throw new APIError("Group ID and Program ID are required", 400);
      }
      
      const groupPrograms = await this.groupProgramService.addProgramToGroup(groupId, programId);
      
      res.status(200).json({
        success: true,
        data: groupPrograms,
        message: "Program added to group successfully"
      });
    } catch (error) {
      next(error);
    }
  };
  
  removeProgramFromGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupId, programId } = req.params;
      
      if (!groupId || !programId) {
        // throw new APIError("Group ID and Program ID are required", 400);
      }
      
      const groupPrograms = await this.groupProgramService.removeProgramFromGroup(groupId, programId);
      
      res.status(200).json({
        success: true,
        data: groupPrograms,
        message: "Program removed from group successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}