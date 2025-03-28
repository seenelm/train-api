import { FullLibraryExerciseRequest } from "../src/app/exerciseLibrary/dto/libraryExerciseDto";

// Sample data for populating the exercise library
export const exerciseLibraryData: FullLibraryExerciseRequest[] = [
    {
        libraryExerciseRequest: {
            name: "Push Up",
            imagePath: undefined,
            description: "A basic push-up exercise to strengthen the chest.",
            categoryId: undefined, // This will be set to the appropriate category ID later
            difficulty: "Beginner",
            equipment: [], // No equipment needed for push-ups
        },
        categoryRequest: {
            name: "Strength",
            description: "Exercises targeting the chest muscles.",
        },
        muscleRequest: [
            {
                name: "Pectorals",
            },
            {
                name: "Triceps",
            },
            {
                name: "Core",
            },
        ],
    },
];
