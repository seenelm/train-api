import express from "express";
const programRouter = express.Router();
import ProgramController from "../controllers/ProgramController";
import ProgramService from "../services/ProgramService";
import ProgramRepository from "../../../infrastructure/database/repositories/ProgramRepository";
import WeekRepository from "../../../infrastructure/database/repositories/WeekRepository";
import WorkoutRepository from "../../../infrastructure/database/repositories/WorkoutRepository";
import ExerciseRepository from "../../../infrastructure/database/repositories/ExerciseRepository";
import SetRepository from "../../../infrastructure/database/repositories/SetRepository";
import { authenticate } from "../../../middleware/authenticate";
import GroupProgramRepository from "../../../infrastructure/database/repositories/GroupProgramRepository";
import GroupProgramService from "../../groups/services/GroupProgramService";

const programRepository = new ProgramRepository();
const weekRepository = new WeekRepository();
const workoutRepository = new WorkoutRepository();
const exerciseRepository = new ExerciseRepository();
const setRepository = new SetRepository();
const groupProgramRepository = new GroupProgramRepository();
const groupProgramService = new GroupProgramService(groupProgramRepository);

const programService = new ProgramService(
    programRepository,
    weekRepository,
    workoutRepository,
    exerciseRepository,
    setRepository,
    groupProgramService
);
const programController = new ProgramController(programService);

programRouter.post("/", authenticate, programController.createProgram);

export default programRouter;
