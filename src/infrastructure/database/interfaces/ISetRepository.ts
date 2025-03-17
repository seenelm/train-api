import { IBaseRepository } from "./IBaseRepository";
import { SetDocument } from "../models/setModel";
import Set from "../entity/Set";

export interface ISetRepository extends IBaseRepository<Set, SetDocument> {}
