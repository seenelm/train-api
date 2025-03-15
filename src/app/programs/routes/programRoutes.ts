import express from "express";
const programRouter = express.Router();
import ProgramController from "../controllers/ProgramController";
import ProgramService from "../services/ProgramService";
import ProgramRepository from "../../../infrastructure/database/repositories/ProgramRepository";
import { authenticate } from "../../../middleware/authenticate";

const programRepository = new ProgramRepository();
const programService = new ProgramService(programRepository);
const programController = new ProgramController(programService);

programRouter.post("/", authenticate, programController.createProgram);

export default programRouter;
