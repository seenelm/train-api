import axios from "axios";
import { exerciseLibraryData } from "./exerciseLibraryData";
import {
    FullLibraryExerciseRequest,
    FullLibraryExerciseResponse,
} from "../src/app/exerciseLibrary/dto/libraryExerciseDto";

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
): Promise<FullLibraryExerciseResponse> {
    try {
        const response = await api.post("/", exerciseData);
        const { data } = response;

        // Create a nicely formatted console output
        console.log("\n---------------------------------------------");
        console.log(`✅ Created: ${data.libraryExercise.name}`);
        console.log("---------------------------------------------");

        // Print library exercise details
        console.log("\nLIBRARY EXERCISE:");
        console.log(JSON.stringify(data.libraryExercise, null, 2));

        // Print category details
        console.log("\nCATEGORY:");
        console.log(JSON.stringify(data.category, null, 2));

        // Print each muscle in detail
        console.log("\nMUSCLES:");
        if (data.muscles && data.muscles.length > 0) {
            // Print each muscle object individually with indentation
            data.muscles.forEach((muscle, index) => {
                console.log(`\n  MUSCLE ${index + 1}:`);
                console.log(
                    "  " +
                        JSON.stringify(muscle, null, 2).replace(/\n/g, "\n  "),
                );
            });
            console.log(`\nTotal muscles: ${data.muscles.length}`);
        } else {
            console.log("  No muscles associated with this exercise.");
        }

        console.log("\n---------------------------------------------\n");

        return data;
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
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    try {
        await createAllExercises();
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
