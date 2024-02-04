import SearchDAO from "../dataAccess/SearchDAO";
import { UserModel } from "../models/userModel";
import { GroupModel } from "../models/groupModel";
import * as Errors from "../utils/errors";
import CustomLogger from "../common/logger";
import { Types } from "mongoose";

class SearchService {
  private searchDAO: SearchDAO;
  private logger: CustomLogger;

  constructor(searchDAO: SearchDAO) {
    // this.searchDAO = new SearchDAO(UserModel, GroupModel);
    this.searchDAO = searchDAO;
    this.logger = new CustomLogger(this.constructor.name);
  }

  public async findUsersAndGroups(query: string | object, userId: Types.ObjectId) {
    if (typeof query === "string" && (!query || query.trim() === "")) {
      throw new Errors.BadRequestError("Invalid query string");
    }

    if (
      typeof query === "object" &&
      (!query || Object.keys(query).length === 0)
    ) {
      throw new Errors.BadRequestError("Invalid query object");
    }

    const result = await this.searchDAO.search(query, userId);
    this.logger.logInfo("Search", { query, result });
    return result;
  }
}

export default SearchService;
