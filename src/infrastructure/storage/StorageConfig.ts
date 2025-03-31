import * as path from "path";

export class StorageConfig {
    public readonly projectId: string;
    public readonly keyFilePath: string;
    public readonly defaultBucket: string;
    public readonly imageFolder: string;
    public readonly videoFolder: string;
    public readonly imageExtensions: string[];
    public readonly videoExtensions: string[];
    public readonly maxFileSize: number; // in bytes

    constructor() {
        // Load configuration from environment or configuration files
        this.projectId = process.env.GOOGLE_CLOUD_PROJECT || "";
        this.keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
        this.defaultBucket =
            process.env.GCS_DEFAULT_BUCKET || "train-app-files";
        this.imageFolder = "exercise-images";
        this.videoFolder = "exercise-videos";
        this.imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        this.videoExtensions = [".mp4", ".webm", ".mov", ".avi"];
        this.maxFileSize = 50 * 1024 * 1024; // 50 MB
    }

    public getFileType(fileName: string): "image" | "video" | "other" {
        const ext = path.extname(fileName).toLowerCase();

        if (this.imageExtensions.includes(ext)) {
            return "image";
        }

        if (this.videoExtensions.includes(ext)) {
            return "video";
        }

        return "other";
    }

    public getFolderForFileType(fileType: "image" | "video" | "other"): string {
        switch (fileType) {
            case "image":
                return this.imageFolder;
            case "video":
                return this.videoFolder;
            default:
                return "other-files";
        }
    }
}
