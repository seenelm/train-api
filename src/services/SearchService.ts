import SearchDAO from "../dataAccess/SearchDAO";
import { UserModel } from "../models/userModel";
import { GroupModel } from "../models/groupModel";
import * as Errors from "../utils/errors";
import logger from "../common/logger";

class SearchService {

    private searchDAO: SearchDAO;

    constructor() {
        this.searchDAO = new SearchDAO(UserModel, GroupModel);
    }

    public async findUsersAndGroups(query: string | object) {
        if (typeof query === 'string' && (!query || query.trim() === "")) {
            logger.error("Invalid query string");
            throw new Errors.BadRequestError("Invalid query string");
        }

        if (typeof query === "object" && (!query || Object.keys(query).length === 0)) {
            logger.error("Invalid query object");
            throw new Errors.BadRequestError("Invalid query object");
        }
        
        const result = await this.searchDAO.search(query);
        logger.info(`Search ${query} `, result);
        return result;
    }

}

export default SearchService;