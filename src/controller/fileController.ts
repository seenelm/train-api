import { NextFunction, Request, Response } from "express";
import FileService from "../service/FileService";


export default class FileController {
    private fileService: FileService;


    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    uploadTestFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.info("Uploading test file to GCS");
            

            const bucketName = req.body.bucketName || process.env.GCS_BUCKET_NAME;
            
            // Generate a unique filename or use the one provided
            const fileName = req.body.fileName || `test-${Date.now()}.txt`;
            
            // Get custom content or use default
            const content = req.body.content || `This is a test file created on ${new Date().toISOString()}`;
            
            // Create and upload the file
            const result = await this.fileService.createAndUploadTestFile(
                bucketName,
                fileName,
                content
            );
            
            return res.status(200).json({
                success: true,
                message: "File created and uploaded successfully",
                data: result
            });
        } catch (error) {
            console.error("Error uploading test file", error);
            next(error);
        }
    };
}