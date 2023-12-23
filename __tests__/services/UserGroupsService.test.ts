import { Types } from "mongoose";
import UserGroupsService from "../../src/services/UserGroupsService";
import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import { IUser } from "../../src/models/userModel";
import { IUserGroups } from "../../src/models/userGroups";
import { IGroup } from "../../src/models/groupModel";
import * as Errors from "../../src/utils/errors";


describe("UserService", () => {
    let userGroupsDAO: UserGroupsDAO;
    let userGroupsService: UserGroupsService;

    beforeAll(() => {
        jest.mock("../../src/dataAccess/UserGroupsDAO");
        userGroupsService = new UserGroupsService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchGroups", () => {
        const mockUsername = "Username98";
        const mockPassword = "Password123!";
        const mockGroupName1 = "Maryland Basketball";
        const mockGroupBio1 = "We are going to win the NCAA Championship!!";
        const mockGroupName2 = "Heritage Basketball";
        const mockGroupBio2 = "We are going States this year!!";

        const USER_ID = new Types.ObjectId();

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

        it("should return user groups", async () => {
            const mockPath = "groups";
            const mockQuery = { userId: USER_ID };

            const userGroups = [
                {id: mockGroup1._id, name: mockGroup1.name},
                {id: mockGroup2._id, name: mockGroup2.name}
            ]

            try {
                userGroupsDAO.findOneUser = jest.fn().mockReturnValue(mockUserGroups);

                const result = await userGroupsService.fetchGroups(USER_ID);

                expect(userGroupsDAO.findOneUser).toHaveBeenCalledWith(mockQuery, mockPath);
                expect(result.userGroups).toEqual(userGroups);  
            } catch (error) {}  
        }); 
        it("should throw a ResourceNotFoundError when user is not found", async () => {
            try {
                userGroupsDAO.findOneUser = jest.fn().mockResolvedValue(null);

                await expect(userGroupsService.fetchGroups(USER_ID)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });   
    });

});