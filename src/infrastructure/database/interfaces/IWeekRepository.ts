import { IBaseRepository } from "./IBaseRepository";
import Week from "../entity/Week";
import { WeekDocument } from "../models/weekModel";

export interface IWeekRepository extends IBaseRepository<Week, WeekDocument> {}
