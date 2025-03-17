import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export default class FileService {

    /**
     * Creates a test file and uploads it to Google Cloud Storage
     * @param bucketName The name of the GCS bucket
     * @param fileName The name of the file to create
     * @param content The content of the file
     * @returns Object with file information
     */
    public async createAndUploadTestFile(
        bucketName: string,
        fileName: string,
        content: string
    ): Promise<any> {
        try {
            // Create a temporary file
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, fileName);
            
            console.log(`Creating test file at: ${tempFilePath}`);
            
            // Write content to the file
            await this.createTestFile(tempFilePath, content);
            
            // Try to upload to GCS if environment is properly configured
            let uploadResult = null;
            try {
                if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                    console.warn("GOOGLE_APPLICATION_CREDENTIALS not set correctly");
                    throw new Error("Google Cloud Storage credentials not properly configured");
                }
                
                uploadResult = await this.uploadFileToGCS(bucketName, tempFilePath, fileName);
                console.info("File uploaded successfully to GCS");
            } catch (uploadError) {
                console.error("Failed to upload to GCS", uploadError);
                // Return file info without GCS upload details
                return {
                    fileName,
                    localPath: tempFilePath,
                    content,
                    uploadedToGCS: false,
                    error: uploadError instanceof Error ? uploadError.message : String(uploadError)
                };
            }
            
            // Clean up the temporary file
            await fs.promises.unlink(tempFilePath);
            
            return {
                fileName,
                content,
                uploadedToGCS: true,
                gcsPath: `gs://${bucketName}/${fileName}`,
                publicUrl: uploadResult.publicUrl
            };
        } catch (error) {
            console.error("Error in createAndUploadTestFile", error);
            throw error;
        }
    }

    /**
     * Creates a file with the specified content
     */
    private createTestFile(filePath: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    console.error("Error creating test file", err);
                    reject(err);
                } else {
                    console.info(`Test file created successfully at ${filePath}`);
                    resolve();
                }
            });
        });
    }

    /**
     * Uploads a file to Google Cloud Storage
     */
    private async uploadFileToGCS(
        bucketName: string,
        filePath: string,
        destinationFileName: string
    ): Promise<any> {
        try {
            // Create a storage client
            const storage = new Storage({
                projectId: process.env.GOOGLE_CLOUD_PROJECT,
            });

            // Get a reference to the bucket
            const bucket = storage.bucket(bucketName);

            await bucket.upload(filePath, {
                destination: destinationFileName,
                metadata: {
                    contentType: "text/plain",
                },
                // Remove the public option which tries to set legacy ACLs
                // public: true,
            });

            // If you still want the file to be publicly accessible, you can make it public after upload
            // using the uniform bucket-level access compatible method
            const file = bucket.file(destinationFileName);
            
            return {
                bucket: bucketName,
                file: destinationFileName,
                // You can construct the public URL if needed
                publicUrl: `https://storage.googleapis.com/${bucketName}/${destinationFileName}`
            };
        } catch (error) {
            console.error("Error uploading file to Google Cloud Storage", error);
            throw error;
        }
    }
}