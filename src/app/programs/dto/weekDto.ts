export interface WeekRequest {
    programId: string;
    name: string;
    description?: string;
    imagePath?: string;
    weekNumber: number;
    workouts: string[];
}

export interface WeekResponse {
    id: string;
    programId: string;
    name: string;
    description?: string;
    imagePath?: string;
    weekNumber: number;
    workouts: string[];
}
