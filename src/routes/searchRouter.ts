import express from "express";
const searchRouter = express.Router();
import * as searchController from "../controllers/searchController";
import { authenticate } from "../__middleware__/authenticate";

searchRouter.get("/", authenticate, searchController.findUsersAndGroups);

export default searchRouter;
