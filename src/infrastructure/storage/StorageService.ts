import { Storage, Bucket } from "@google-cloud/storage";
import { APIError } from "../../common/errors/APIError";

export class StorageService {
    private storage: Storage;
    private bucket: Bucket;

    constructor(bucketName: string) {
        // Initialize Google Cloud Storage
        this.storage = new Storage({
            projectId: process.env.GOOGLE_CLOUD_PROJECT,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });

        this.bucket = this.storage.bucket(bucketName);
    }

    /**
     * Upload a file buffer to Google Cloud Storage
     */
    public async uploadImage(
        buffer: Buffer,
        fileName: string,
        objectPrefix: string,
        contentType: string,
    ): Promise<string> {
        try {
            // Generate a unique file path
            const filePath = `${objectPrefix}/${fileName}`;
            const file = this.bucket.file(filePath);

            // Upload the file
            await file.save(buffer, {
                metadata: {
                    contentType,
                },
                public: true,
            });

            // Return the public URL
            return `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;
        } catch (error) {
            throw APIError.InternalServerError(
                `Failed to upload image: ${error}`,
            );
        }
    }
}

export default StorageService;
