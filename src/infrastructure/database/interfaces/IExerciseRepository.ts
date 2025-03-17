import { IBaseRepository } from "./IBaseRepository";
import { ExerciseDocument } from "../models/exerciseModel";
import Exercise from "../entity/Exercise";

export interface IExerciseRepository
    extends IBaseRepository<Exercise, ExerciseDocument> {}
