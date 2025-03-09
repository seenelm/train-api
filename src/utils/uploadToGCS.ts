import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Function to create a test.txt file
const createTestFile = (filePath: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error creating test file:", err);
        reject(err);
      } else {
        console.log(`Test file created successfully at ${filePath}`);
        resolve();
      }
    });
  });
};

// Function to upload a file to Google Cloud Storage
const uploadFileToGCS = async (
  bucketName: string,
  filePath: string,
  destinationFileName: string
): Promise<void> => {
  try {
    console.log("Environment variables:");
    console.log("PROJECT_ID:", process.env.PROJECT_ID);
    console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
    console.log("GCS_BUCKET_NAME:", process.env.GCS_BUCKET_NAME);
    console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

    // Create a storage client using environment variables instead of a key file
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });

    // Get a reference to the bucket
    const bucket = storage.bucket(bucketName);

    // Upload the file to the bucket
    await bucket.upload(filePath, {
      destination: destinationFileName,
      metadata: {
        contentType: "text/plain",
      },
    });

    console.log(
      `${filePath} uploaded to ${bucketName}/${destinationFileName} successfully.`
    );
  } catch (error) {
    console.error("Error uploading file to Google Cloud Storage:", error);
    throw error;
  }
};

// Main function to execute the file creation and upload
const main = async () => {
  try {
    // Define file paths and content
    const testFilePath = path.join(__dirname, "../../test.txt");
    const testFileContent = "This is a test file created on " + new Date().toISOString();
    const bucketName = process.env.GCS_BUCKET_NAME;
    const destinationFileName = "test.txt";

    // Check if required environment variables are set
    if (!process.env.GOOGLE_CLOUD_PROJECT) {
      throw new Error("GOOGLE_CLOUD_PROJECT environment variable is required");
    }

    if (!bucketName) {
      throw new Error("GCS_BUCKET_NAME environment variable is required");
    }

    // Create the test file
    await createTestFile(testFilePath, testFileContent);

    // Upload the file to GCS
    await uploadFileToGCS(bucketName, testFilePath, destinationFileName);

    console.log("File creation and upload process completed successfully!");
  } catch (error) {
    console.error("Error in main process:", error);
  }
};

// Execute the main function if this file is run directly
if (require.main === module) {
  main();
}

// Export functions for use in other files
export { createTestFile, uploadFileToGCS };