export interface ProgramRequest {
    name: string;
    description?: string;
    category?: string;
    imagePath?: string;
    createdBy: string;
    numWeeks?: number;
    weeks: string[];
    difficulty?: string;
}

export interface ProgramResponse {
    id: string;
    name: string;
    description?: string;
    category?: string;
    imagePath?: string;
    createdBy: string;
    numWeeks?: number;
    weeks: string[];
    difficulty?: string;
}
