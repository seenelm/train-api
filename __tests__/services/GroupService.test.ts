import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import { Types } from "mongoose";
import * as Errors from "../../src/utils/errors";
import { IGroup } from "../../src/models/groupModel";
import { GroupService } from "../../src/services/GroupService";
import { GroupModel } from "../../src/models/groupModel";
import { UserGroupsModel } from "../../src/models/userGroups";
import { mock } from "node:test";
import { group } from "node:console";
import { ProfileAccess } from "../../src/common/constants";

jest.mock("../../src/dataAccess/UserGroupsDAO");
jest.mock("../../src/dataAccess/GroupDAO");

describe("GroupService", () => {
  let userGroupsDAO: jest.Mocked<UserGroupsDAO>;
  let groupDAO: jest.Mocked<GroupDAO>;
  let groupService: GroupService;

  beforeAll(() => {
    // userGroupsDAO = jest.requireMock("../../src/dataAccess/UserGroupsDAO");
    // groupDAO = jest.requireMock("../../src/dataAccess/GroupDAO");
    userGroupsDAO = new UserGroupsDAO(
      UserGroupsModel
    ) as jest.Mocked<UserGroupsDAO>;
    groupDAO = new GroupDAO(GroupModel) as jest.Mocked<GroupDAO>;

    groupService = new GroupService(groupDAO, userGroupsDAO);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("addGroup", () => {
    // it("should add a group to the user's groups", async () => {
    //   const mockGroupName = "Washington Commanders";
    //   const mockGroupId = new Types.ObjectId();
    //   const mockUserId = new Types.ObjectId();
    //   const mockOwnerId = mockUserId;
    //   const mockUserGroupId = new Types.ObjectId();
    //   const mockGroup: Partial<IGroup> = {
    //     _id: mockGroupId,
    //     name: mockGroupName,
    //     owners: [mockOwnerId],
    //     users: [],
    //     requests: [],
    //   };
    //   const mockUserGroups = {
    //     _id: mockUserGroupId,
    //     userId: mockUserId,
    //     groups: [mockGroup._id],
    //   } as IUserGroups;
    //   userGroupsDAO.findOne = jest.fn().mockResolvedValue(mockUserGroups);
    //   groupDAO.create = jest.fn().mockResolvedValue(mockGroup);
    //   const result = await groupService.addGroup(mockGroupName, mockUserId);
    //   expect(userGroupsDAO.findOne).toHaveBeenCalledWith({
    //     userId: mockUserId,
    //   });
    //   expect(groupDAO.create).toHaveBeenCalledWith([{ name: mockGroupName }]);
    //   expect(result).toEqual(mockGroup);
    // });
    // it("should throw a ResourceNotFoundError when user is not found", async () => {
    //     const mockGroupName = "Washington Commanders";
    //     const mockUserId = mockUser._id;
    //     try {
    //         userGroupsDAO.findOne = jest.fn().mockReturnValue(null);
    //         await expect(groupService.addGroup(mockGroupName, mockUserId)).rejects.toThrow(Errors.ResourceNotFoundError);
    //     } catch (error) {}
    // });
  });

  describe("fetchGroup", () => {
    it("should return the group if it exists", async () => {
      const mockGroupId = new Types.ObjectId();
      //   const mockGroup = { _id: mockGroupId, name: "Test Group" };
      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: "We are going to win the SuperBowl this year!!",
        owners: [],
        users: [],
        requests: [],
      };

      groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);

      await expect(groupService.fetchGroup(mockGroupId)).resolves.toEqual(
        mockGroup
      );
      expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
    });
    it("should throw a ResourceNotFoundError when group does not exist", async () => {
      const mockGroupId = new Types.ObjectId();
      try {
        groupDAO.findById = jest.fn().mockReturnValue(null);

        await groupService.fetchGroup(mockGroupId);
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Group not found.");
      }
    });
  });

  describe("updateGroupBio", () => {
    it("should update groups bio", async () => {
      const mockGroupBio = "We are going to win the SuperBowl this year!!";
      const mockUserId = new Types.ObjectId();
      const mockOwnerId = mockUserId;
      const mockGroupId = new Types.ObjectId();

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      const mockUpdatedGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: mockGroupBio,
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      const mockFilter = { _id: mockGroup._id };
      const mockUpdate = { bio: mockGroupBio };
      const mockOptions = { new: true };

      groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);

      groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

      await groupService.updateGroupBio(mockUserId, mockGroupId, mockGroupBio);

      expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
      expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
        mockFilter,
        mockUpdate,
        mockOptions
      );
      expect(mockUpdatedGroup.bio).toEqual(mockGroupBio);
    });

    it("should throw BadRequestError if the group bio is null", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      try {
        expect(
          await groupService.updateGroupBio(mockUserId, mockGroupId, null)
        ).rejects.toThrow(Errors.BadRequestError);
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual("Group Bio is Undefined");
      }
    });

    it("should throw ResourceNotFoundError when group does not exist", async () => {
      const mockGroupBio = "We are going to win the SuperBowl this year!!";
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();

      try {
        groupDAO.findOne = jest.fn().mockReturnValue(null);

        await groupService.updateGroupBio(
          mockUserId,
          mockGroupId,
          mockGroupBio
        );

        expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
        expect(groupDAO.findOne).toBeNull();
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Group does not exist");
      }
    });

    it("should throw ForbiddenError if the user is not the owner", async () => {
      const mockGroupBio = "We are going to win the SuperBowl this year!!";
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      const mockOwnerId = mockUserId;

      const USER_ID = new Types.ObjectId();

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      try {
        groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);

        await groupService.updateGroupBio(USER_ID, mockGroupId, mockGroupBio);

        expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
        expect(groupDAO.findOne).not.toBeNull();
      } catch (error) {
        const err = error as Errors.ForbiddenError;
        expect(err).toBeInstanceOf(Errors.ForbiddenError);
        expect(err.statusCode).toEqual(403);
        expect(err.message).toEqual(
          "User doesn't have permission to update group bio"
        );
      }
    });
  });

  describe("updateGroupName", () => {
    it("should update groups name", async () => {
      const mockGroupBio = "We are going to win the SuperBowl this year!!";
      const mockGroupName = "Maryland Terrapins";
      const mockUserId = new Types.ObjectId();
      const mockOwnerId = mockUserId;
      const mockGroupId = new Types.ObjectId();

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: mockGroupBio,
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      const mockUpdatedGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: mockGroupName,
        bio: mockGroupBio,
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      const mockFilter = { _id: mockGroup._id };
      const mockUpdate = { name: mockGroupName };
      const mockOptions = { new: true };

      groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);
      groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

      await groupService.updateGroupName(
        mockUserId,
        mockGroupId,
        mockGroupName
      );

      expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
      expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
        mockFilter,
        mockUpdate,
        mockOptions
      );
      expect(mockUpdatedGroup.name).toEqual(mockGroupName);
    });

    it("should throw BadRequestError if the group name is null", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      try {
        expect(
          await groupService.updateGroupName(mockUserId, mockGroupId, null)
        ).rejects.toThrow(Errors.BadRequestError);
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual("Invalid Group Name");
      }
    });

    it("should throw a BadRequestError if groupName is empty", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      try {
        expect(
          await groupService.updateGroupName(mockUserId, mockGroupId, "")
        ).rejects.toThrow(Errors.BadRequestError);
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual("Invalid Group Name");
      }
    });
    it("should throw ResourceNotFoundError when group does not exist", async () => {
      const mockGroupName = "Maryland Terripans";
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();

      try {
        groupDAO.findOne = jest.fn().mockReturnValue(null);

        await groupService.updateGroupName(
          mockUserId,
          mockGroupId,
          mockGroupName
        );

        expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
        expect(groupDAO.findOne).toBeNull();
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Group does not exist");
      }
    });

    it("should throw ForbiddenError if the user is not the owner", async () => {
      const mockGroupName = "Maryland Terrapins";
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      const mockOwnerId = mockUserId;

      const USER_ID = new Types.ObjectId();

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        owners: [mockOwnerId],
        users: [],
        requests: [],
      };

      try {
        groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);

        await groupService.updateGroupName(USER_ID, mockGroupId, mockGroupName);

        expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
        expect(groupDAO.findOne).toEqual(mockGroup);
      } catch (error) {
        const err = error as Errors.ForbiddenError;
        expect(err).toBeInstanceOf(Errors.ForbiddenError);
        expect(err.statusCode).toEqual(403);
        expect(err.message).toEqual(
          "User doesn't have permission to update group name"
        );
      }
    });
  });

  describe("joinGroup", () => {
    it("should add user to group", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      const mockOwnerId = mockUserId;

      const mockUserTwoId = new Types.ObjectId();

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: "We are going to win the SuperBowl this year!!",
        owners: [mockOwnerId],
        users: [],
        requests: [],
        accountType: ProfileAccess.Public,
      };

      const mockUpdatedGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: "We are going to win the SuperBowl this year!!",
        owners: [mockOwnerId],
        users: [mockUserTwoId],
        requests: [],
        accountType: ProfileAccess.Public,
      };

      groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
      groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

      await groupService.joinGroup(mockUserTwoId, mockGroupId);

      expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
      expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockGroupId },
        { $addToSet: { users: mockUserTwoId } },
        { new: true }
      );
    });

    it("should throw ResourceNotFoundError when group does not exist", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();

      try {
        groupDAO.findById = jest.fn().mockReturnValue(null);

        await groupService.joinGroup(mockUserId, mockGroupId);

        expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
        expect(groupDAO.findById).toBeNull();
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Group does not exist");
      }
    });

    it("should throw BadRequestError if the group account is not public", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      const mockOwnerId = mockUserId;

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: "We are going to win the SuperBowl this year!!",
        owners: [mockOwnerId],
        users: [],
        requests: [],
        accountType: ProfileAccess.Private,
      };

      try {
        groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

        await groupService.joinGroup(mockUserId, mockGroupId);

        expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
        expect(groupDAO.findById).toEqual(mockGroup);
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual(
          `Group ${mockGroup.name} account is not public`
        );
      }
    });

    it("should throw ConflictError if the user is already a member of the group", async () => {
      const mockUserId = new Types.ObjectId();
      const mockGroupId = new Types.ObjectId();
      const mockOwnerId = mockUserId;

      const mockGroup: Partial<IGroup> = {
        _id: mockGroupId,
        name: "Test Group",
        bio: "We are going to win the SuperBowl this year!!",
        owners: [mockOwnerId],
        users: [mockUserId],
        requests: [],
        accountType: ProfileAccess.Public,
      };

      try {
        groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

        await groupService.joinGroup(mockUserId, mockGroupId);

        expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
        expect(groupDAO.findById).toEqual(mockGroup);
      } catch (error) {
        const err = error as Errors.ConflictError;
        expect(err).toBeInstanceOf(Errors.ConflictError);
        expect(err.statusCode).toEqual(409);
        expect(err.message).toEqual("User is already member of group");
      }
    });
  });
});
