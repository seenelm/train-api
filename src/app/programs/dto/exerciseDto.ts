export interface ExerciseRequest {
    name?: string;
    group?: string;
    imagePath?: string;
    weight?: string;
    targetSets?: number;
    targetReps?: number;
    notes?: string;
    completed?: boolean;
    createdBy: string;
    sets: string[];
}

export interface ExerciseResponse {
    id: string;
    name?: string;
    group?: string;
    imagePath?: string;
    weight?: string;
    targetSets?: number;
    targetReps?: number;
    notes?: string;
    completed?: boolean;
    createdBy: string;
    sets: string[];
}
