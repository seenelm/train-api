import SearchDAO from "../dataAccess/SearchDAO";
import { UserModel } from "../models/userModel";
import { GroupModel } from "../models/groupModel";
import * as Errors from "../utils/errors";

class SearchService {

    private searchDAO: SearchDAO;

    constructor() {
        this.searchDAO = new SearchDAO(UserModel, GroupModel);
    }

    public async findUsersAndGroups(query: string | object) {
        if (typeof query === 'string' && (!query || query.trim() === "")) {
            throw new Errors.BadRequestError("Invalid query string");
        }

        if (typeof query === "object" && (!query || Object.keys(query).length === 0)) {
            throw new Errors.BadRequestError("Invalid query object");
        }
        
        const result = await this.searchDAO.search(query);
        console.log("Search: ", result);
        return result;
    }

}

export default SearchService;