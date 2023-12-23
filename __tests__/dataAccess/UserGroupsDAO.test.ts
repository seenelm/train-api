import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import { UserGroupsModel, IUserGroups } from "../../src/models/userGroups";
import { IUser } from "../../src/models/userModel";
import { IGroup } from "../../src/models/groupModel";
import { Types } from "mongoose";

describe("UserGroupsDAO", () => {
    let userGroupsDAO: UserGroupsDAO;

    beforeAll(() => {
        userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
        jest.mock("../../src/models/userGroups");
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("findOneUser", () => {
        const mockUsername = "Username98";
        const mockPassword = "Password123!";
        const mockGroupName1 = "Maryland Basketball";
        const mockGroupBio1 = "We are going to win the NCAA Championship!!";
        const mockGroupName2 = "Heritage Basketball";
        const mockGroupBio2 = "We are going States this year!!";

        const mockUser = {
            _id: new Types.ObjectId(),
            username: mockUsername,
            password: mockPassword,
            isActive: true,
        } as IUser

        const mockGroup1 = {
            _id: new Types.ObjectId(),
            name: mockGroupName1,
            bio: mockGroupBio1
        } as IGroup

        const mockGroup2 = {
            _id: new Types.ObjectId(),
            name: mockGroupName2,
            bio: mockGroupBio2
        } as IGroup

        const mockUserGroups = {
            userId: mockUser._id,
            groups: [mockGroup1._id, mockGroup2._id]
        } as IUserGroups

        it("should find user and populate groups path", async () => {
            const mockPath = "groups";
            const mockUserId = new Types.ObjectId();
            const mockQuery = { userId: mockUserId };

            UserGroupsModel.findOne = jest.fn().mockImplementation(() => ({
                populate: () => ({ exec: jest.fn().mockReturnValue(mockUserGroups)})
            }));

            const result = await userGroupsDAO.findOneUser(mockQuery, mockPath);
            
            expect(UserGroupsModel.findOne).toHaveBeenCalledWith(mockQuery);
            expect(result).toEqual(mockUserGroups);
        });
        it("should return null when user is not found", async () => {
            const mockPath = "groups";
            const mockUserId = new Types.ObjectId();
            const mockQuery = { userId: mockUserId };

            UserGroupsModel.findOne = jest.fn().mockImplementation(() => ({
                populate: () => ({ exec: jest.fn().mockReturnValue(null)})
            }));

            const result = await userGroupsDAO.findOneUser(mockQuery, mockPath);
            
            expect(UserGroupsModel.findOne).toHaveBeenCalledWith(mockQuery);
            expect(result).toBeNull();
        });

    });
});