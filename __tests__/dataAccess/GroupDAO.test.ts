import GroupDAO from "../../src/dataAccess/GroupDAO";
import { GroupModel, IGroup } from "../../src/models/groupModel";
import { IUser } from "../../src/models/userModel";
import { Types } from "mongoose";
import { InternalServerError } from "../../src/utils/errors";

import { 
    mockUser,
    mockUserGroups,
    mockGroup,
} from "../mocks/groupMocks";

describe("GroupDAO", () => {
    let groupDAO: GroupDAO;

    beforeAll(() => {
        groupDAO = new GroupDAO(GroupModel);
        jest.mock("../../src/models/groupModel");
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("create", () => {
        it("should create a new group", async () => {
            const mockGroupName = "Washington Commanders";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;

            const mockGroup = {
                _id: new Types.ObjectId(),
                name: mockGroupName,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            GroupModel.create = jest.fn().mockResolvedValue(mockGroup);
            // act
            const group = await groupDAO.create({name: mockGroupName});
        
            // assert
            expect(group).toEqual(mockGroup);
            expect(GroupModel.create).toHaveBeenCalledWith({name: mockGroupName});
          
        })
        it("should throw an Internal Server Error", async () => {
            const mockGroupName = "Washington Commanders";
            GroupModel.create = jest.fn().mockRejectedValue(new Error("Database Error"));
            try {
                // act
                const group = await groupDAO.create({name: mockGroupName});
        
                // assert
                expect(group).rejects.toThrow(InternalServerError);
            } catch (error) {}
        });
    });

    describe("findOne", () => {
        it("should find a group", async () => {
            const mockGroupName = "Washington Commanders";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;

            const mockGroup = {
                _id: new Types.ObjectId(),
                name: mockGroupName,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            // arrange
            let mockQuery = { _id: mockGroup._id };

            GroupModel.findOne = jest.fn().mockImplementation(() => ({
                exec: jest.fn().mockReturnValue(mockGroup)
            }));

            // act
            const group = await groupDAO.findOne(mockQuery);

            // assert
            expect(GroupModel.findOne).toHaveBeenCalledWith(mockQuery);
            expect(group).toEqual(mockGroup);
        });
        it("should return null", async () => {
            const mockGroupName = "Washington Commanders";
            const mockUserId = mockUser._id;
            const mockOwnerId = mockUserId;

            const mockGroup = {
                _id: new Types.ObjectId(),
                name: mockGroupName,
                owners: [mockOwnerId],
                users: new Types.DocumentArray<IUser>([]),
                requests: new Types.DocumentArray<IUser>([])
            } as IGroup

            // arrange
            let mockQuery = { _id: mockGroup._id };

            GroupModel.findOne = jest.fn().mockImplementation(() => ({
                exec: jest.fn().mockReturnValue(null)
            }));
            // act
            const group = await groupDAO.findOne(mockQuery);

            // assert
            expect(group).toBeNull();
        });
      });
});