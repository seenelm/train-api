import { IBaseRepository } from "./IBaseRepository";
import { ProgramDocument } from "../models/programModel";
import Program from "../entity/Program";

export interface IProgramRepository
    extends IBaseRepository<Program, ProgramDocument> {}
