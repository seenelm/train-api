import { FullLibraryExerciseRequest } from "../src/app/exerciseLibrary/dto/libraryExerciseDto";

// Sample data for populating the exercise library
export const exerciseLibraryData: FullLibraryExerciseRequest[] = [
    {
        libraryExerciseRequest: {
            name: "Crunches",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: [],
        },
        categoryRequest: {
            name: "Abs",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Abs",
                primary: true,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Leg Raises",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: [],
        },
        categoryRequest: {
            name: "Abs",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Abs",
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Assisted Pull Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Assisted Pull Up Machine", "Banded Pull Up"],
        },
        categoryRequest: {
            name: "Back",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Lats",
                primary: true,
            },
            {
                name: "Biceps",
                primary: false,
            },
            {
                name: "Upper Back",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Assisted Chin Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Assisted Pull Up Machine", "Banded Pull Up"],
        },
        categoryRequest: {
            name: "Back",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Lats",
                primary: true,
            },
            {
                name: "Biceps",
                primary: false,
            },
            {
                name: "Upper Back",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Barbell Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Barbell"],
        },
        categoryRequest: {
            name: "Back",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Lats",
                primary: true,
            },
            {
                name: "Upper Back",
                primary: true,
            },
            {
                name: "Biceps",
                primary: false,
            },
            {
                name: "Lower Back",
                primary: false,
            },
            {
                name: "Rear Delts",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cable"],
        },
        categoryRequest: {
            name: "Back",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Lats",
                primary: true,
            },
            {
                name: "Upper Back",
                primary: true,
            },
            {
                name: "Rear Delts",
                primary: false,
            },
        ],
    },
];
