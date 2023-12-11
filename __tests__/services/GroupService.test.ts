import UserDAO from "../../src/dataAccess/UserDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import GroupService from "../../src/services/GroupService";
import { Types } from "mongoose";
import * as Errors from "../../src/utils/errors";
import { IGroup, Group } from "../../src/models/groupModel";
import { IUser } from "../../src/models/userModel";

const USER_ID = new Types.ObjectId();

const mockUser = {
    _id: new Types.ObjectId(),
    name: "Noah Gross",
    username: "ngross",
    password: "Password98!",
    groups: []
}

const mockGroup = {
    _id: new Types.ObjectId(),
    name: "Washington Commanders",
    owner: [],
    users: [],
    requests: []
}

const mockUpdatedUser = {
    _id: new Types.ObjectId(),
    name: "Noah Gross",
    username: "ngross",
    password: "Password98!",
    groups: [
        {
            _id: mockGroup._id,
        }
    ]
}

const mockUpdatedGroup = {
    _id: new Types.ObjectId(),
    name: "Washington Commanders",
    owner: [
        {
            _id: mockUser._id,
        }
    ],
    users: [],
    requests: []
}

describe("GroupService", () => {
    let userDAO: UserDAO;
    let groupDAO: GroupDAO;
    let groupService: GroupService;

    beforeAll(() => {
        jest.mock("../../src/dataAccess/UserDAO");
        jest.mock("../../src/dataAccess/GroupDAO");

        groupService = new GroupService();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("addGroup", () => {
        it("should add a group", async () => {
            const groupName = "Washington Commanders";

            try {
                userDAO.findById = jest.fn().mockReturnValue(mockUser);
                groupDAO.create = jest.fn().mockResolvedValue(mockGroup);

                const result = await groupService.addGroup(groupName, USER_ID);

                expect(mockGroup).toEqual(mockUpdatedGroup);
                expect(mockUser).toEqual(mockUpdatedUser);

                expect(result).toEqual({
                    id: mockGroup._id,
                    name: mockGroup.name
                });

                expect(mockUpdatedGroup.owner).toEqual(USER_ID);
                expect(mockUpdatedUser.groups.includes(mockGroup._id)).toBe(true);
            } catch (error) {}
        });
        it("should throw a ResourceNotFoundError when user is not found", async () => {
            const groupName = "Washington Commanders";
            try {
                userDAO.findById= jest.fn().mockResolvedValue(null);

                await expect(groupService.addGroup(groupName, USER_ID)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });
    });

    describe("updateGroupBio", () => {
        const GROUP_ID = new Types.ObjectId();
        const USER_ID = new Types.ObjectId();

        const mockUser = {
            _id: USER_ID, 
            name: "Noah Gross", 
            username: "ngross", 
            password: "Password123!",
            bio: "I love to code!"
        } as IUser

        const mockGroup = {
            _id: GROUP_ID,
            name: "Maryland Football",
            bio: "",
            owners: [mockUser._id],
        } as IGroup

        const mockGroup2 = {
            _id: GROUP_ID,
            name: "Golden State Warriors",
            bio: "NBA Champions!",
            owners: [mockUser._id],
        } as IGroup

        it("should add group bio", async () => {
            const mockGroupBio = "Maryland Football is in the Big10!";

            try {
                groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
                const groupInstance = new Group(mockGroup);

                const result = await groupService.updateGroupBio(USER_ID, GROUP_ID, mockGroupBio);
                
                expect(groupDAO.findById).toHaveBeenCalledWith(GROUP_ID);
                expect(groupInstance.setBio).toHaveBeenCalledWith(mockGroupBio);
                expect(mockGroup.bio).toEqual(mockGroupBio);
            } catch (error) {}
        });
        it("should update group bio", async () => {
            const mockGroupBio = "We are going to win the NBA Championship this year!!";

            try {
                groupDAO.findById = jest.fn().mockReturnValue(mockGroup2);
                const groupInstance = new Group(mockGroup2);

                const result = await groupService.updateGroupBio(USER_ID, GROUP_ID, mockGroupBio);
                
                expect(groupDAO.findById).toHaveBeenCalledWith(GROUP_ID);
                expect(groupInstance.setBio).toHaveBeenCalledWith(mockGroupBio);
                expect(mockGroup2.bio).toEqual(mockGroupBio);

            } catch (error) {}
        });
        it("should throw ForbiddenError if the user is not the owner", async () => {
            const mockGroupBio = "Maryland Football is in the Big10!";
            const mockGroupID = new Types.ObjectId();

            try {
                groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
                const groupInstance = new Group(mockGroup);

                const result = await groupService.updateGroupBio(USER_ID, mockGroupID, mockGroupBio);

                expect(result).rejects.toThrow(Errors.ForbiddenError);
                expect(groupDAO.findById).toHaveBeenCalledWith(GROUP_ID);
                expect(groupInstance.setBio).toHaveBeenCalledWith(mockGroupBio);

            } catch (error) {}
        });
        it("should throw ResourceNotFoundError when group does not exist", async () => {
            const mockGroupBio = "Maryland Football is in the Big10!";

            try {
                groupDAO.findById = jest.fn().mockReturnValue(null);

                const result = await groupService.updateGroupBio(USER_ID, GROUP_ID, mockGroupBio);

                expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                expect(groupDAO.findById).toBeNull();
            } catch (error) {}
        });
        it("should throw a BadRequestError if groupBio is null", async () => {
            try {
                const result = await groupService.updateGroupBio(USER_ID, GROUP_ID, null);
                expect(result).rejects.toThrow(Errors.BadRequestError);
            } catch (error) {}
        });
    });

    describe("updateGroupName", () => {
        const GROUP_ID = new Types.ObjectId();
        const USER_ID = new Types.ObjectId();

        const mockUser = {
            _id: USER_ID, 
            name: "Noah Gross", 
            username: "ngross", 
            password: "Password123!",
            bio: "I love to code!"
        } as IUser

        const mockGroup = {
            _id: GROUP_ID,
            name: "Maryland Football",
            bio: "",
            owners: [mockUser._id],
        } as IGroup

        it("should update groups name", async () => {
            const mockGroupName = "Maryland Terrapins";

            try {
                groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
                const groupInstance = new Group(mockGroup);

                const result = await groupService.updateGroupName(USER_ID, GROUP_ID, mockGroupName);

                expect(groupDAO.findById).toHaveBeenCalledWith(GROUP_ID);
                expect(groupInstance.setName).toHaveBeenCalledWith(mockGroupName);
                expect(mockGroup.name).toEqual(mockGroupName);

            } catch (error) {}
        });
        it("should throw ForbiddenError if the user is not the owner", async () => {
            const mockGroupName = "Maryland Terrapins";
            const mockGroupID = new Types.ObjectId();

            try {
                groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
                const groupInstance = new Group(mockGroup);

                const result = await groupService.updateGroupName(USER_ID, mockGroupID, mockGroupName);

                expect(result).rejects.toThrow(Errors.ForbiddenError);
                expect(groupDAO.findById).toHaveBeenCalledWith(GROUP_ID);
                expect(groupInstance.setName).toHaveBeenCalledWith(mockGroupName);

            } catch (error) {}
        });
        it("should throw ResourceNotFoundError when group does not exist", async () => {
            const mockGroupName = "Maryland Terrapins";

            try {
                groupDAO.findById = jest.fn().mockReturnValue(null);

                const result = await groupService.updateGroupName(USER_ID, GROUP_ID, mockGroupName);

                expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                expect(groupDAO.findById).toBeNull();
            } catch (error) {}
        });
        it("should throw a BadRequestError if groupName is null or empty", async () => {
            try {
                expect(await groupService.updateGroupName(USER_ID, GROUP_ID, null)).rejects.toThrow(Errors.BadRequestError);
                expect(await groupService.updateGroupName(USER_ID, GROUP_ID, "")).rejects.toThrow(Errors.BadRequestError);
            } catch (error) {}
        });
    });
});