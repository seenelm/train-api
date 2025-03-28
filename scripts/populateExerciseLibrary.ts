import axios from "axios";
import { exerciseLibraryData } from "./exerciseLibraryData";
import { FullLibraryExerciseRequest } from "../src/app/exerciseLibrary/dto/libraryExerciseDto";

const API_URL = "http://localhost:3000/api/exercise-library";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        //   ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
    },
});

/**
 * Creates a single exercise in the library via API call
 */
async function createExercise(
    exerciseData: FullLibraryExerciseRequest,
): Promise<void> {
    try {
        console.log(
            `Creating exercise: ${exerciseData.libraryExerciseRequest.name}`,
        );

        const response = await api.post("/", exerciseData);

        console.log(response);
        console.log(`Response status: ${response.status}`);
        console.log(`Exercise ID: ${response.data.id}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                `Error creating exercise ${exerciseData.libraryExerciseRequest.name}:`,
            );
            console.error(`Status: ${error.response?.status}`);
            console.error(
                `Message: ${error.response?.data?.message || error.message}`,
            );
            console.error(`Details:`, error.response?.data);
        } else {
            console.error(
                `Unexpected error creating exercise ${exerciseData.libraryExerciseRequest.name}:`,
                error,
            );
        }
        throw error;
    }
}

/**
 * Creates all exercises in the library via API calls
 */
async function createAllExercises(): Promise<void> {
    console.log(
        `Starting to create ${exerciseLibraryData.length} exercises...`,
    );

    // Process exercises sequentially to avoid overwhelming the API
    for (const exerciseData of exerciseLibraryData) {
        try {
            await createExercise(exerciseData);
        } catch (error) {
            console.error(
                `Skipping exercise ${exerciseData.libraryExerciseRequest.name} due to error`,
            );
        }
    }

    console.log("Finished creating exercises");
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    try {
        // Choose one of the following methods:

        // 1. Sequential creation (safer, slower)
        await createAllExercises();

        // 2. Batch creation with concurrency (faster, but more API load)
        // await createExercisesInBatches(3);

        console.log("Exercise creation completed successfully");
    } catch (error) {
        console.error("Exercise creation failed:", error);
        process.exit(1);
    }
}

// Execute the script
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error("Unhandled error:", err);
            process.exit(1);
        });
}
