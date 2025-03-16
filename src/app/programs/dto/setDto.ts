export interface SetRequest {
    weight?: number;
    reps?: number;
    completed?: boolean;
    imagePath?: string;
    link?: string;
    createdBy: string;
}

export interface SetResponse {
    id: string;
    weight?: number;
    reps?: number;
    completed?: boolean;
    imagePath?: string;
    link?: string;
    createdBy: string;
}
