import { Request, Response, NextFunction } from "express";
import MediaHubService from "./MediaHubService";

export default class MediaHubController {
    private mediaHubService: MediaHubService;

    constructor(mediaHubService: MediaHubService) {
        this.mediaHubService = mediaHubService;
    }

    public uploadUserProfileImage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ error: "No User Profile image uploaded" });
            }

            await this.mediaHubService.uploadUserProfileImage(req.file);
            return res.status(200).json({
                message: "User Profile image uploaded successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
