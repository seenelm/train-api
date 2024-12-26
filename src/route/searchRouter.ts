import express from "express";
const searchRouter = express.Router();
import * as searchController from "../controller/searchController";
import { authenticate } from "../middleware/authenticate";

searchRouter.get(
    "/search/query",
    authenticate,
    searchController.findUsersAndGroups,
);

export default searchRouter;
