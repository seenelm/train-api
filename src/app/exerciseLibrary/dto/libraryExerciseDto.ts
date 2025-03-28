import { Types } from "mongoose";

export interface FullLibraryExerciseRequest {
    libraryExerciseRequest: LibaryExerciseRequest;
    categoryRequest: CategoryRequest;
    muscleRequest: MuscleRequest[];
}

export interface FullLibraryExerciseResponse {
    libraryExercise: LibraryExerciseResponse;
    category: CategoryResponse;
    muscles: MuscleResponse[];
}

export function toFullLibraryExerciseResponse(
    libraryExercise: LibraryExerciseResponse,
    category: CategoryResponse,
    muscles: MuscleResponse[],
): FullLibraryExerciseResponse {
    return {
        libraryExercise,
        category,
        muscles,
    };
}

export interface LibaryExerciseRequest {
    name: string;
    imagePath?: string;
    description?: string;
    categoryId?: string | Types.ObjectId;
    difficulty?: string;
    equipment?: string[];
}

export interface LibraryExerciseResponse {
    id: Types.ObjectId;
    name: string;
    imagePath?: string;
    description?: string;
    difficulty?: string;
    equipment?: string[];
}

export interface CategoryRequest {
    name: string;
    description?: string;
}

export interface CategoryResponse {
    id: Types.ObjectId;
    name: string;
    description?: string;
}

export interface MuscleRequest {
    name: string;
}

export interface MuscleResponse {
    id: Types.ObjectId;
    name: string;
}
