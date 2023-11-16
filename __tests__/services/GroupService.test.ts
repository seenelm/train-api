import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import GroupService from "../../src/services/GroupService";
import { Types } from "mongoose";
import * as Errors from "../../src/utils/errors";
import { IGroup } from "../../src/models/groupModel";
import { IUser } from "../../src/models/userModel";

import { 
    mockUser,
    mockUserGroups,
    mockGroup,
} from "../mocks/groupMocks";



describe("GroupService", () => {
    let userGroupsDAO: UserGroupsDAO;
    let groupDAO: GroupDAO;
    let groupService: GroupService;

    beforeAll(() => {
        jest.mock("../../src/dataAccess/UserGroupsDAO");
        jest.mock("../../src/dataAccess/GroupDAO");

        groupService = new GroupService();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("addGroup", () => {
        it("should add a group", async () => {
            const mockGroupName3 = "Washington Commanders";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroup3 = {
                _id: new Types.ObjectId(),
                name: mockGroupName3,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                userGroupsDAO.findOne = jest.fn().mockReturnValue(mockUserGroups);
                groupDAO.create = jest.fn().mockResolvedValue(mockGroup3);

                const result = await groupService.addGroup(mockGroupName3, mockUserId);

                expect(result).toEqual({
                    id: mockGroup3._id,
                    name: mockGroup3.name
                });

                expect(userGroupsDAO.findOne).toHaveBeenCalledWith({ userId: mockUserId });
                expect(groupDAO.create).toHaveBeenCalledWith({ mockGroupName3 });
                expect(mockGroup3.owners.includes(mockOwnerId)).toBe(true);
                expect(mockUserGroups.groups.includes(mockGroup3._id)).toBe(true);
            } catch (error) {}
        });
        it("should throw a ResourceNotFoundError when user is not found", async () => {
            const mockGroupName = "Washington Commanders";
            const mockUserId = mockUser._id;
            try {
                userGroupsDAO.findOne = jest.fn().mockReturnValue(null);

                await expect(groupService.addGroup(mockGroupName, mockUserId)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });
    });

    describe("updateGroupBio", () => {
        it("should add group bio", async () => {
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroupId = mockGroup._id;

            const mockFilter = { _id: mockGroup._id };
            const mockUpdate = { bio: mockGroupBio };
            const mockOptions = { new: true };

            const mockUpdatedGroup = {
                _id: mockGroupId,
                name: mockGroup.name,
                bio: mockGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

                await groupService.updateGroupBio(mockUserId, mockGroupId, mockGroupBio);
                
                expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
                expect(mockUpdatedGroup.bio).toEqual(mockGroupBio);
            } catch (error) {}
        });
        it("should update group bio", async () => {
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUpdatedGroupBio = "We are going to beat the Bengals today!!";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroupId = mockGroup._id;

            const mockFilter = { _id: mockGroup._id };
            const mockUpdate = { bio: mockUpdatedGroupBio };
            const mockOptions = { new: true };

            const mockUpdatedGroup = {
                _id: mockGroupId,
                name: mockGroup.name,
                bio: mockGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            const mockUpdatedGroup2 = {
                _id: mockGroupId,
                name: mockGroup.name,
                bio: mockUpdatedGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup2);

                await groupService.updateGroupBio(mockUserId, mockGroupId, mockUpdatedGroupBio);
                
                expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
                expect(mockUpdatedGroup.bio).toEqual(mockUpdatedGroupBio);
            } catch (error) {}
        });
        it("should throw ForbiddenError if the user is not the owner", async () => {
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroupId = mockGroup._id;

            const USER_ID = new Types.ObjectId();

            const mockFilter = { _id: mockGroup._id };
            const mockUpdate = { bio: mockGroupBio };
            const mockOptions = { new: true };

            const mockUpdatedGroup = {
                _id: mockGroupId,
                name: mockGroup.name,
                bio: mockGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                const error = new Errors.ForbiddenError("User doesn't have permission to update group bio");
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

                const result = await groupService.updateGroupBio(USER_ID, mockGroupId, mockGroupBio);

                expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
                expect(result).rejects.toThrow(Errors.ForbiddenError);
                expect(error.statusCode).toEqual(403);
                expect(error.message).toEqual("User doesn't have permission to update group bio");

            } catch (error) {}
        });
        it("should throw ResourceNotFoundError when group does not exist", async () => {
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUserId = mockUser._id;
            const mockGroupId = mockGroup._id;

            try {
                const error = new Errors.ResourceNotFoundError("Group does not exist");
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

                const result = await groupService.updateGroupBio(mockUserId, mockGroupId, mockGroupBio);

                expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Group does not exist");

            } catch (error) {}
        });
        it("should throw a BadRequestError if groupBio is null", async () => {
            const mockUserId = mockUser._id;
            const mockGroupId = mockGroup._id;
            try {
                const error = new Errors.BadRequestError("Group Bio is Undefined");

                const result = await groupService.updateGroupBio(mockUserId, mockGroupId, null);

                expect(result).rejects.toThrow(Errors.BadRequestError);
                expect(error.statusCode).toEqual(400);
                expect(error.message).toEqual("Group Bio is Undefined");
            } catch (error) {}
        });
    });

    describe("updateGroupName", () => {
        it("should update groups name", async () => {
            const mockGroupName = "Maryland Terrapins";
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroupId = mockGroup._id;

            const mockFilter = { _id: mockGroup._id };
            const mockUpdate = { name: mockGroupName };
            const mockOptions = { new: true };

            const mockUpdatedGroup = {
                _id: mockGroupId,
                name: mockGroupName,
                bio: mockGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

                await groupService.updateGroupName(mockUserId, mockGroupId, mockGroupName);
                
                expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
                expect(mockUpdatedGroup.name).toEqual(mockGroupName);
            } catch (error) {}
        });
        it("should throw ForbiddenError if the user is not the owner", async () => {
            const mockGroupName = "Maryland Terrapins";
            const mockGroupBio = "We are going to win the SuperBowl this year!!";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;
            const mockGroupId = mockGroup._id;

            const USER_ID = new Types.ObjectId();

            const mockFilter = { _id: mockGroup._id };
            const mockUpdate = { name: mockGroupName };
            const mockOptions = { new: true };

            const mockUpdatedGroup = {
                _id: mockGroupId,
                name: mockGroupName,
                bio: mockGroupBio,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            try {
                const error = new Errors.ForbiddenError("User doesn't have permission to update group name");
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

                const result = await groupService.updateGroupName(USER_ID, mockGroupId, mockGroupName);

                expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
                expect(result).rejects.toThrow(Errors.ForbiddenError);
                expect(error.statusCode).toEqual(403);
                expect(error.message).toEqual("User doesn't have permission to update group name");

            } catch (error) {}
        });
        it("should throw ResourceNotFoundError when group does not exist", async () => {
            const mockGroupName = "Maryland Terripans";
            const mockUserId = mockUser._id;
            const mockGroupId = mockGroup._id;

            try {
                const error = new Errors.ResourceNotFoundError("Group does not exist");
                groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

                const result = await groupService.updateGroupName(mockUserId, mockGroupId, mockGroupName);

                expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Group does not exist");

            } catch (error) {}
        });
        it("should throw a BadRequestError if groupName is null or empty", async () => {
            const mockUserId = mockUser._id;
            const mockGroupId = mockGroup._id;
            try {
                expect(await groupService.updateGroupName(mockUserId, mockGroupId, null)).rejects.toThrow(Errors.BadRequestError);
                expect(await groupService.updateGroupName(mockUserId, mockGroupId, "")).rejects.toThrow(Errors.BadRequestError);
            } catch (error) {}
        });
    });
});