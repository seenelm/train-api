import { IBaseRepository } from "./IBaseRepository";
import { WorkoutDocument } from "../models/workoutModel";
import Workout from "../entity/Workout";

export interface IWorkoutRepository
    extends IBaseRepository<Workout, WorkoutDocument> {}
