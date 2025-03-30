import { Types } from "mongoose";

export interface FullLibraryExerciseRequest {
    libraryExerciseRequest: LibaryExerciseRequest;
    categoryRequest: CategoryRequest;
    muscleRequest: MuscleRequest[];
}

export interface FullLibraryExerciseResponse {
    libraryExercise: LibraryExerciseResponse;
    category: CategoryResponse;
    muscles: ExerciseMusclesResponse[];
}

export function toFullLibraryExerciseResponse(
    libraryExercise: LibraryExerciseResponse,
    category: CategoryResponse,
    muscles: ExerciseMusclesResponse[],
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
    id: string;
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
    id: string;
    name: string;
    description?: string;
}

export interface MuscleRequest {
    name: string;
    primary?: boolean;
}

export interface MuscleResponse {
    id: string;
    name: string;
}

export interface ExerciseMusclesResponse {
    id: string;
    exerciseId?: string;
    muscle: MuscleResponse;
    primary: boolean;
}

export interface ExerciseMusclesRequest {
    exerciseId: string;
    muscleId: string;
    primary: boolean;
}
