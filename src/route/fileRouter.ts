import express from "express";
import { authenticate } from "../middleware/authenticate";
import FileController from "../controller/fileController";
import FileService from "../service/FileService";

const fileRouter = express.Router();
const fileService = new FileService();
const fileController = new FileController(fileService);

fileRouter.post("/upload-test", fileController.uploadTestFile);


export default fileRouter;