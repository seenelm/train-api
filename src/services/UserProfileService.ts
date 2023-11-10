import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { UserProfileModel } from "../models/userProfile";
import * as Errors from "../utils/errors";
import { Types } from "mongoose";

class UserProfileService {
    private userProfileDAO: UserProfileDAO;

    constructor() {
        this.userProfileDAO = new UserProfileDAO(UserProfileModel);
    }

    public async updateUserBio(userId: Types.ObjectId | string, userBio: string | null): Promise<void> {
    
        if (!userBio) {
          throw new Errors.BadRequestError("Users Bio is Undefined");
        }
    
        const user = await this.userProfileDAO.findOneAndUpdate(
          {userId: userId}, 
          { bio: userBio }, 
          { new: true }
        );
    
        if (!user) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }
      }
    
      public async updateUsersFullName(userId: Types.ObjectId | string, name: string | null): Promise<void> {
        
        if (!name) {
          throw new Errors.BadRequestError("Users Name is Undefined");
        }
    
        const user = await this.userProfileDAO.findOneAndUpdate(
          {userId: userId}, 
          { name }, 
          { new: true }
        );
    
        if (!user) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }
      }
    
}

export default UserProfileService;