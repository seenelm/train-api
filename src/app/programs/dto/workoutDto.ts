export interface WorkoutRequest {
    title?: string;
    description?: string;
    imagePath?: string;
    completed?: boolean;
    createdBy: string;
    exercises: string[];
}

export interface WorkoutResponse {
    id: string;
    title?: string;
    description?: string;
    imagePath?: string;
    completed?: boolean;
    createdBy: string;
    exercises: string[];
}
