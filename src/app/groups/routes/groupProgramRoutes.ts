import { Router } from "express";
import GroupProgramController from "../controllers/GroupProgramController";
import GroupProgramService from "../services/GroupProgramService";
import GroupProgramRepository from "../../../infrastructure/database/repositories/GroupProgramRepository";
import {authenticate} from "../../../middleware/authenticate";

const router = Router();
const groupProgramRepository = new GroupProgramRepository();
const groupProgramService = new GroupProgramService(groupProgramRepository);
const groupProgramController = new GroupProgramController(groupProgramService);

// Get all programs for a group
router.get(
  "/:groupId/programs",
  authenticate,
  groupProgramController.getGroupPrograms
);

// Add a program to a group
router.post(
  "/:groupId/programs",
  authenticate,
  groupProgramController.addProgramToGroup
);

// Remove a program from a group
router.delete(
  "/:groupId/programs/:programId",
  authenticate,
  groupProgramController.removeProgramFromGroup
);

export default router;