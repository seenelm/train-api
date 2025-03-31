import express from "express";
import multer from "multer";
import MediaHubController from "./MediaHubController";
import StorageService from "../../infrastructure/storage/StorageService";
import MediaHubService from "./MediaHubService";

const mediaHubRouter = express.Router();
const storageService = new StorageService("trainapp");
const mediaHubService = new MediaHubService(storageService);
const mediaHubController = new MediaHubController(mediaHubService);

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 10 * 1024 * 1024, // 10 MB limit
    // },
});

mediaHubRouter.post(
    "/upload/user-profile-image",
    upload.single("image"),
    mediaHubController.uploadUserProfileImage,
);

export default mediaHubRouter;
