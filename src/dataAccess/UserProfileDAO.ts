import BaseDAO from "./BaseDAO";
import { IUserProfile } from "../models/userProfile";
import { Model } from "mongoose";

class UserProfileDAO extends BaseDAO<IUserProfile> {
    private userProfile: Model<IUserProfile>;
  
    constructor(userProfile: Model<IUserProfile>) {
        super(userProfile);
        this.userProfile = userProfile;
    }
}

export default UserProfileDAO;