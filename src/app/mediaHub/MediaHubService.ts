import StorageService from "../../infrastructure/storage/StorageService";

export default class MediaHubService {
    private storageService: StorageService;

    constructor(storageService: StorageService) {
        this.storageService = storageService;
    }

    public async uploadUserProfileImage(
        file: Express.Multer.File,
    ): Promise<void> {
        try {
            if (!file) {
                throw new Error("No User Profile image uploaded");
            }

            const fileName = `${Date.now()}_${file.originalname}`;

            const url = await this.storageService.uploadImage(
                file.buffer,
                fileName,
                "user-profile",
                file.mimetype,
            );
        } catch (error) {
            console.error("Error uploading user profile image", error);
            throw new Error("Failed to upload user profile image");
        }
    }
}
