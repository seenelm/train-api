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
    // BACK EXERCISES
    {
        libraryExerciseRequest: {
            name: "Barbell Bent Over Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
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
                name: "Biceps",
                primary: false,
            },
            {
                name: "Lower Back",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Barbell Reverse-Grip Bent Over Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
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
                name: "Biceps",
                primary: false,
            },
            {
                name: "Lower Back",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Barbell Landmine Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
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
            name: "Barbell Rack Pull",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Advanced",
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
                name: "Lower Back",
                primary: true,
            },
            {
                name: "Traps",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Chin Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Bodyweight", "Other"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Hammer-Grip Wide Seated Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Standard-Grip Seated Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Wide-Grip Seated Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable V-Handle Seated Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
                name: "Mid Back",
                primary: true,
            },
            {
                name: "Biceps",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Single-Arm Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Bar Straight Arm Pull Down",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Cable Rope Straight Arm Pull Down",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Dumbbell Incline Bench Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Dumbbells", "Bench"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Dumbbell Bench Supported Single-Arm Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Dumbbells", "Bench"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Dumbbell Bent Over Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Dumbbells"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Dumbbell Single-Arm Bent Over Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Dumbbells"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Dumbbell Pullover",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Dumbbells", "Bench"],
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
                name: "Chest",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Hammer-Grip Pull UP",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Bodyweight", "Other"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Lat Pull Down Reverse-Grip",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Lat Pull Down Standard-Grip",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Lat Pull Down Wide-Grip",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Lat Pull Down Hammer-Grip",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Cables"],
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
        ],
    },
    {
        libraryExerciseRequest: {
            name: "L-Sit Pull Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Expert",
            equipment: ["Bodyweight", "Other"],
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
                name: "Abs",
                primary: true,
            },
            {
                name: "Biceps",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Machine Assisted Pull Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Assisted Pull Up Machine"],
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
            name: "Machine Assisted Chin Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Assisted Pull Up Machine"],
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
            name: "Machine Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Machines"],
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
            name: "Machine T-Bar Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Machines"],
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
            name: "Muscle Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Expert",
            equipment: ["Bodyweight", "Other"],
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
                name: "Shoulders",
                primary: true,
            },
            {
                name: "Abs",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Pull Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Bodyweight", "Other"],
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
                primary: false,
            },
            {
                name: "Biceps",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Resistance Band Pull Up",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Resistance Bands"],
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
                primary: false,
            },
            {
                name: "Biceps",
                primary: false,
            },
        ],
    },
    {
        libraryExerciseRequest: {
            name: "Smith Machine Bent Over Row",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Beginner",
            equipment: ["Smith Machine"],
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
                primary: false,
            },
            {
                name: "Lower Back",
                primary: false,
            },
        ],
    },
    // CHEST EXERCISES
    {
        libraryExerciseRequest: {
            name: "Barbell Bench Press",
            imagePath: undefined,
            description: undefined,
            categoryId: undefined,
            difficulty: "Intermediate",
            equipment: ["Barbell", "Bench"],
        },
        categoryRequest: {
            name: "Back",
            description: undefined,
        },
        muscleRequest: [
            {
                name: "Chest",
                primary: true,
            },
            {
                name: "Triceps",
                primary: false,
            },
        ],
    },
];
