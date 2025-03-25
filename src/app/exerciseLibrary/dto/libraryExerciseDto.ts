import { Types } from "mongoose";

export interface LibaryExerciseRequest {
    name: string;
    description: string;
    categoryId: Types.ObjectId;
    difficulty: string;
    equipment?: string[];
}

export interface LibaryExerciseResponse {
    id: Types.ObjectId;
    name: string;
    description: string;
    categoryId: Types.ObjectId;
    difficulty: string;
    equipment?: string[];
}
