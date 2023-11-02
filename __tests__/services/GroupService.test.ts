import UserDAO from "../../src/dataAccess/UserDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import GroupService from "../../src/services/GroupService";
import { Types } from "mongoose";
import * as Errors from "../../src/utils/errors";

jest.mock("../../src/dataAccess/UserDAO");
jest.mock("../../src/dataAccess/GroupDAO");

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

    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("addGroup", () => {
        it("should add a group", async () => {
            const groupName = "Washington Commanders";

            try {
                userDAO.findById = jest.fn().mockReturnValue(mockUser);
                groupDAO.create = jest.fn().mockResolvedValue(mockGroup);

                const result = await GroupService.addGroup(groupName, USER_ID);

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

                await expect(GroupService.addGroup(groupName, USER_ID)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });
    });
})