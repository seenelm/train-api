import { Types } from "mongoose";

export interface FullLibraryExerciseRequest {
    libraryExerciseRequest: LibaryExerciseRequest;
    categoryRequest: CategoryRequest;
    muscleRequest: MuscleRequest[];
}

export interface LibaryExerciseRequest {
    name: string;
    imagePath?: string;
    description?: string;
    categoryId?: Types.ObjectId;
    difficulty?: string;
    equipment?: string[];
}

export interface LibaryExerciseResponse {
    id: Types.ObjectId;
    name: string;
    imagePath?: string;
    description?: string;
    categoryId?: Types.ObjectId;
    difficulty?: string;
    equipment?: string[];
}

export interface CategoryRequest {
    name: string;
    description?: string;
}

export interface MuscleRequest {
    name: string;
}
