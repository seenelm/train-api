import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import { Types } from "mongoose";
import * as Errors from "../../src/utils/errors";
import { IGroup } from "../../src/models/groupModel";
import GroupService from "../../src/services/GroupService";
import { GroupModel } from "../../src/models/groupModel";
import { UserGroupsModel } from "../../src/models/userGroups";
import { ProfileAccess } from "../../src/common/constants";
import { IUserGroups } from "../../src/models/userGroups";
import { mock } from "node:test";

jest.mock("../../src/dataAccess/UserGroupsDAO");
jest.mock("../../src/dataAccess/GroupDAO");
// Define common mock objects at the top of your test suite
const mockGroupId = new Types.ObjectId();
const mockUserId = new Types.ObjectId();
const mockOwnerId = mockUserId;
const mockGroupBio = "We are going to win the SuperBowl this year!!";
const mockAccountType: number = 2;
const mockGroupName = "Maryland Terrapins";

const mockGroup: Partial<IGroup> = {
  _id: mockGroupId,
  groupName: "Test Group",
  owners: [mockOwnerId],
  users: [],
  requests: [],
};

const mockUpdatedGroup: Partial<IGroup> = {
  _id: mockGroupId,
  groupName: "Test Group",
  bio: mockGroupBio,
  owners: [mockOwnerId],
  users: [],
  requests: [],
};

describe("GroupService", () => {
  let userGroupsDAO: jest.Mocked<UserGroupsDAO>;
  let groupDAO: jest.Mocked<GroupDAO>;
  let groupService: GroupService;

  beforeAll(() => {
    userGroupsDAO = new UserGroupsDAO(
      UserGroupsModel
    ) as jest.Mocked<UserGroupsDAO>;
    groupDAO = new GroupDAO(GroupModel) as jest.Mocked<GroupDAO>;

    groupService = new GroupService(groupDAO, userGroupsDAO);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchGroup", () => {
    it("should return the group if it exists", async () => {
      groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);
  
      await expect(groupService.fetchGroup(mockGroupId)).resolves.toEqual(
        mockGroup
      );
      expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
    });
  
    it("should throw a ResourceNotFoundError when group does not exist", async () => {
      groupDAO.findById = jest.fn().mockReturnValue(null);
  
      try {
        await groupService.fetchGroup(mockGroupId);
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Group not found");
      }
    });
  });

  describe("updateGroupProfile", () => {
    it("should update groups profile", async () => {
      const mockFilter = { _id: mockGroup._id };
      const mockUpdate = { bio: mockGroupBio };
      const mockOptions = { new: true };
  
      groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);
      groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);
  
      await groupService.updateGroupProfile(mockUserId, mockGroupId, mockGroupBio, mockGroupName, mockAccountType);
  
      expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
      expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
        mockFilter,
        mockUpdate,
        mockOptions
      );
      expect(mockUpdatedGroup.bio).toEqual(mockGroupBio);
    });
  });
  it("should throw ForbiddenError if the user is not the owner", async () => {
    const mockGroupBio = "We are going to win the SuperBowl this year!!";
    const mockUserId = new Types.ObjectId();
    const mockOwnerId = mockUserId;
    const mockGroupId = new Types.ObjectId();
    const mockAccountType: number = 2;
    const mockGroupName = "Maryland Terrapins";

    const mockGroup: Partial<IGroup> = {
      _id: mockGroupId,
      groupName: "Test Group",
      owners: [mockOwnerId],
      users: [],
      requests: [],
    };

    try {
      groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);

      await groupService.updateGroupProfile(mockUserId, mockGroupId, mockGroupBio, mockGroupName, mockAccountType);

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

  // describe("addGroup", () => {
  //   it("should add a group to the user's groups", async () => {
  //     userGroupsDAO.findOne = jest.fn().mockResolvedValue(mockGroup);
  //     groupDAO.create = jest.fn().mockResolvedValue(mockGroup);
  //     const result = await groupService.addGroup(mockGroupName, mockUserId);
  //     expect(userGroupsDAO.findOne).toHaveBeenCalledWith({
  //       userId: mockUserId,
  //     });
  //     expect(groupDAO.create).toHaveBeenCalledWith([{ name: mockGroupName }]);
  //     expect(result).toEqual(mockGroup);
  //   });
  //   it("should throw a ResourceNotFoundError when user is not found", async () => {
  //       const mockGroupName = "Washington Commanders";
  //       const mockUserId = mockUserId._id;
  //       try {
  //           userGroupsDAO.findOne = jest.fn().mockReturnValue(null);
  //           await expect(groupService.addGroup(mockGroupName, mockUserId)).rejects.toThrow(Errors.ResourceNotFoundError);
  //       } catch (error) {}
  //   });
  // });

    // it("should throw BadRequestError if the group bio is null", async () => {
    //   const mockUserId = new Types.ObjectId();
    //   const mockGroupId = new Types.ObjectId();
    //   try {
    //     expect(
    //       await groupService.updateGroupProfile(mockUserId, mockGroupId, null)
    //     ).rejects.toThrow(Errors.BadRequestError);
    //   } catch (error) {
    //     const err = error as Errors.BadRequestError;
    //     expect(err).toBeInstanceOf(Errors.BadRequestError);
    //     expect(err.statusCode).toEqual(400);
    //     expect(err.message).toEqual("Group Bio is Undefined");
    //   }
    // });

    // it("should throw ResourceNotFoundError when group does not exist", async () => {
    //   const mockGroupBio = "We are going to win the SuperBowl this year!!";
    //   const mockUserId = new Types.ObjectId();
    //   const mockGroupId = new Types.ObjectId();

    //   try {
    //     groupDAO.findOne = jest.fn().mockReturnValue(null);

    //     await groupService.updateGroupBio(
    //       mockUserId,
    //       mockGroupId,
    //       mockGroupBio
    //     );

    //     expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
    //     expect(groupDAO.findOne).toBeNull();
    //   } catch (error) {
    //     const err = error as Errors.ResourceNotFoundError;
    //     expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
    //     expect(err.statusCode).toEqual(404);
    //     expect(err.message).toEqual("Group does not exist");
    //   }
    // });

    

  // describe("updateGroupName", () => {
  //   it("should update groups name", async () => {
  //     const mockGroupBio = "We are going to win the SuperBowl this year!!";
  //     const mockGroupName = "Maryland Terrapins";
  //     const mockUserId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;
  //     const mockGroupId = new Types.ObjectId();
  //     const mockAccountType: number = 1;

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       groupName: "Test Group",
  //       bio: mockGroupBio,
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       groupName: mockGroupName,
  //       bio: mockGroupBio,
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //     };

  //     const mockFilter = { _id: mockGroup._id };
  //     const mockUpdate = { name: mockGroupName };
  //     const mockOptions = { new: true };
  //     groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);
  //     await groupService.updateGroupProfile(mockUserId, mockGroupId, mockGroupBio, mockGroupName, mockAccountType);
  //     expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       mockFilter,
  //       mockUpdate,
  //       mockOptions
  //     );
  //     expect(mockUpdatedGroup.groupName).toEqual(mockGroupName);
  //   });

  //   it("should throw BadRequestError if the group name is null", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     try {
  //       expect(
  //         await groupService.updateGroupName(mockUserId, mockGroupId, null)
  //       ).rejects.toThrow(Errors.BadRequestError);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("Invalid Group Name");
  //     }
  //   });

  //   it("should throw a BadRequestError if groupName is empty", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     try {
  //       expect(
  //         await groupService.updateGroupName(mockUserId, mockGroupId, "")
  //       ).rejects.toThrow(Errors.BadRequestError);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("Invalid Group Name");
  //     }
  //   });
  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockGroupName = "Maryland Terripans";
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     try {
  //       groupDAO.findOne = jest.fn().mockReturnValue(null);

  //       await groupService.updateGroupName(
  //         mockUserId,
  //         mockGroupId,
  //         mockGroupName
  //       );

  //       expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
  //       expect(groupDAO.findOne).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockGroupName = "Maryland Terrapins";
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const USER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //     };

  //     try {
  //       groupDAO.findOne = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.updateGroupName(USER_ID, mockGroupId, mockGroupName);

  //       expect(groupDAO.findOne).toHaveBeenCalledWith({ _id: mockGroupId });
  //       expect(groupDAO.findOne).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to update group name"
  //       );
  //     }
  //   });
  // });

  // describe("updateAccountType", () => {
  //   it("should update groups account type", async () => {
  //     const mockGroupBio = "We are going to win the SuperBowl this year!!";
  //     const mockGroupName = "Maryland Terrapins";
  //     const mockUserId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;
  //     const mockGroupId = new Types.ObjectId();
  //     const mockAccountType: number = 2;

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: mockGroupName,
  //       bio: mockGroupBio,
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: mockGroupName,
  //       bio: mockGroupBio,
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockFilter = { _id: mockGroup._id };
  //     const mockUpdate = { accountType: mockAccountType };
  //     const mockOptions = { new: true };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedGroup);

  //     await groupService.updateAccountType(
  //       mockOwnerId,
  //       mockGroupId,
  //       mockAccountType
  //     );

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       mockFilter,
  //       mockUpdate,
  //       mockOptions
  //     );
  //     expect(mockUpdatedGroup.accountType).toEqual(ProfileAccess.Private);
  //   });

  //   it("should throw a ForbiddenError if the user is not the owner", async () => {
  //     const mockGroupBio = "We are going to win the SuperBowl this year!!";
  //     const mockGroupName = "Maryland Terrapins";
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: mockGroupName,
  //       bio: mockGroupBio,
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.updateAccountType(
  //         OWNER_ID,
  //         mockGroupId,
  //         ProfileAccess.Private
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to update account type"
  //       );
  //     }
  //   });

  //   it("should throw a ResourceNotFoundError when group does not exist", async () => {
  //     const mockGroupBio = "We are going to win the SuperBowl this year!!";
  //     const mockGroupName = "Maryland Terrapins";
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.updateAccountType(
  //         mockOwnerId,
  //         mockGroupId,
  //         ProfileAccess.Private
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });
  // });

  // describe("joinGroup", () => {
  //   it("should add user to group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const mockUserTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [mockUserTwoId],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.joinGroup(mockUserTwoId, mockGroupId);

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $addToSet: { users: mockUserTwoId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.joinGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw BadRequestError if the group account is not public", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.joinGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual(
  //         `Group ${mockGroup.name} account is not public`
  //       );
  //     }
  //   });

  //   it("should throw ConflictError if the user is already a member of the group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.joinGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ConflictError;
  //       expect(err).toBeInstanceOf(Errors.ConflictError);
  //       expect(err.statusCode).toEqual(409);
  //       expect(err.message).toEqual("User is already member of group");
  //     }
  //   });
  // });

  // describe("requestToJoinGroup", () => {
  //   it("should add user to group requests", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const mockUserTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [mockUserTwoId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.requestToJoinGroup(mockUserTwoId, mockGroupId);

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $addToSet: { requests: mockUserTwoId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.requestToJoinGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw BadRequestError if the group account is not private", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Public,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.requestToJoinGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual(
  //         `Group ${mockGroup.name} account is not private`
  //       );
  //     }
  //   });

  //   it("should throw ConflictError if the user already sent a request", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;
  //     const mockUserTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [mockUserTwoId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.requestToJoinGroup(mockUserTwoId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ConflictError;
  //       expect(err).toBeInstanceOf(Errors.ConflictError);
  //       expect(err.statusCode).toEqual(409);
  //       expect(err.message).toEqual("User already sent a request");
  //     }
  //   });

  //   it("should throw ConflictError if the user is already a member of the group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;
  //     const mockUserTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [mockUserTwoId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.requestToJoinGroup(mockUserTwoId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ConflictError;
  //       expect(err).toBeInstanceOf(Errors.ConflictError);
  //       expect(err.statusCode).toEqual(409);
  //       expect(err.message).toEqual("User is already member of group");
  //     }
  //   });
  // });

  // describe("acceptGroupRequest", () => {
  //   it("should add user to group", async () => {
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [mockUserId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.acceptGroupRequest(
  //       mockUserId,
  //       mockOwnerId,
  //       mockGroupId
  //     );

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       {
  //         $addToSet: { users: mockUserId },
  //         $pull: { requests: mockUserId },
  //       },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockUserTwoId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.acceptGroupRequest(
  //         mockUserId,
  //         mockUserTwoId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw BadRequestError if the group account is not private", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = mockUserId;
  //     const mockUserTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [mockUserTwoId],
  //       accountType: ProfileAccess.Public,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.acceptGroupRequest(
  //         mockUserId,
  //         mockUserTwoId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual(
  //         `Group ${mockGroup.name} account is not private`
  //       );
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [mockUserId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.acceptGroupRequest(
  //         mockUserId,
  //         OWNER_ID,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to accept group request"
  //       );
  //     }
  //   });

  //   it("should throw BadRequestError if the user is not in the group requests", async () => {
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.acceptGroupRequest(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("User did not request to join group");
  //     }
  //   });
  // });

  // describe("rejectGroupRequest", () => {
  //   it("should remove user from group requests", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [mockUserId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.rejectGroupRequest(
  //       mockUserId,
  //       mockOwnerId,
  //       mockGroupId
  //     );

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $pull: { requests: mockUserId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.rejectGroupRequest(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw BadRequestError if the group account is not private", async () => {
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [mockUserId],
  //       accountType: ProfileAccess.Public,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.rejectGroupRequest(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual(
  //         `Group ${mockGroup.name} account is not private`
  //       );
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [mockUserId],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.rejectGroupRequest(
  //         mockUserId,
  //         OWNER_ID,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to reject group request"
  //       );
  //     }
  //   });

  //   it("should throw BadRequestError if the user is not in the group requests", async () => {
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       users: [],
  //       owners: [mockOwnerId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.rejectGroupRequest(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("User did not request to join group");
  //     }
  //   });
  // });

  // describe("leaveGroup", () => {
  //   it("should remove user from group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       bio: "We are going to win the SuperBowl this year!!",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.leaveGroup(mockUserId, mockGroupId);

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $pull: { users: mockUserId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.leaveGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw a BadRequestError if the user is not in the group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.leaveGroup(mockUserId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("User is not a member of the group");
  //     }
  //   });
  // });

  // describe("removeUserFromGroup", () => {
  //   it("should remove user from group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockReturnValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.removeUserFromGroup(
  //       mockUserId,
  //       mockOwnerId,
  //       mockGroupId
  //     );

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $pull: { users: mockUserId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(null);

  //       await groupService.removeUserFromGroup(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.removeUserFromGroup(
  //         mockUserId,
  //         OWNER_ID,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to remove user from group"
  //       );
  //     }
  //   });

  //   it("should throw a BadRequestError if the user is not in the group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockReturnValue(mockGroup);

  //       await groupService.removeUserFromGroup(
  //         mockUserId,
  //         mockOwnerId,
  //         mockGroupId
  //       );

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.BadRequestError;
  //       expect(err).toBeInstanceOf(Errors.BadRequestError);
  //       expect(err.statusCode).toEqual(400);
  //       expect(err.message).toEqual("User is not a member of the group");
  //     }
  //   });
  // });

  // describe("deleteGroup", () => {
  //   it("should delete group", async () => {
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockUserId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockOwnerUserGroups: Partial<IUserGroups> = {
  //       _id: new Types.ObjectId(),
  //       userId: mockOwnerId,
  //       groups: [],
  //     };

  //     const mockUserGroups: Partial<IUserGroups> = {
  //       _id: new Types.ObjectId(),
  //       userId: mockUserId,
  //       groups: [],
  //     };

  //     groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);
  //     groupDAO.findByIdAndDelete = jest.fn().mockResolvedValue(mockGroup);
  //     userGroupsDAO.updateMany = jest.fn().mockResolvedValue({});

  //     await groupService.deleteGroup(mockOwnerId, mockGroupId);

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findByIdAndDelete).toHaveBeenCalledWith(mockGroupId);
  //     expect(userGroupsDAO.updateMany).toHaveBeenCalledWith(
  //       { groups: mockGroupId },
  //       { $pull: { groups: mockGroupId } },
  //       { isDeleted: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockResolvedValue(null);

  //       await groupService.deleteGroup(mockOwnerId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockOwnerId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);

  //       await groupService.deleteGroup(OWNER_ID, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to delete group"
  //       );
  //     }
  //   });
  // });

  // describe("addOwner", () => {
  //   it("should add owner to group", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const mockOwnerTwoId = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     const mockUpdatedGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId, mockOwnerTwoId],
  //       users: [mockUserId],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);
  //     groupDAO.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGroup);

  //     await groupService.addOwner(mockOwnerTwoId, mockOwnerId, mockGroupId);

  //     expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //     expect(groupDAO.findOneAndUpdate).toHaveBeenCalledWith(
  //       { _id: mockGroupId },
  //       { $addToSet: { owners: mockOwnerTwoId } },
  //       { new: true }
  //     );
  //   });

  //   it("should throw ResourceNotFoundError when group does not exist", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     try {
  //       groupDAO.findById = jest.fn().mockResolvedValue(null);

  //       await groupService.addOwner(mockUserId, mockOwnerId, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toBeNull();
  //     } catch (error) {
  //       const err = error as Errors.ResourceNotFoundError;
  //       expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
  //       expect(err.statusCode).toEqual(404);
  //       expect(err.message).toEqual("Group does not exist");
  //     }
  //   });

  //   it("should throw ForbiddenError if the user is not the owner", async () => {
  //     const mockUserId = new Types.ObjectId();
  //     const mockGroupId = new Types.ObjectId();
  //     const mockOwnerId = new Types.ObjectId();

  //     const OWNER_ID = new Types.ObjectId();

  //     const mockGroup: Partial<IGroup> = {
  //       _id: mockGroupId,
  //       name: "Test Group",
  //       owners: [mockOwnerId],
  //       users: [],
  //       requests: [],
  //       accountType: ProfileAccess.Private,
  //     };

  //     try {
  //       groupDAO.findById = jest.fn().mockResolvedValue(mockGroup);

  //       await groupService.addOwner(mockUserId, OWNER_ID, mockGroupId);

  //       expect(groupDAO.findById).toHaveBeenCalledWith(mockGroupId);
  //       expect(groupDAO.findById).toEqual(mockGroup);
  //     } catch (error) {
  //       const err = error as Errors.ForbiddenError;
  //       expect(err).toBeInstanceOf(Errors.ForbiddenError);
  //       expect(err.statusCode).toEqual(403);
  //       expect(err.message).toEqual(
  //         "User doesn't have permission to add owner"
  //       );
  //     }
  //   });
  // });
// });
