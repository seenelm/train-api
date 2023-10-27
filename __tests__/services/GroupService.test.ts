import UserDAO from "../../src/dataAccess/UserDAO";
import GroupDAO from "../../src/dataAccess/GroupDAO";
import GroupService from "../../src/services/GroupService";
import { Types } from "mongoose";

jest.mock("../../src/dataAccess/UserDAO");
jest.mock("../../src/dataAccess/GroupDAO");

describe("GroupService", () => {
    let userDAO: UserDAO;
    let groupDAO: GroupDAO;

    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("addGroup", () => {
        it("should add a group", async () => {
            const groupName = "Washington Commanders";
            const userId = new Types.ObjectId();

            const mockUser = {
                name: "name",
                username: "username",
                password: "Password123!",
                groups: [new Types.ObjectId()],
                _id: new Types.ObjectId()
            }

            const mockGroup = {
                name: "Washington Commanders",
                owner: new Types.ObjectId(),
                users: [new Types.ObjectId()],
                _id: new Types.ObjectId()
            }

            try {
                userDAO.findById = jest.fn().mockReturnValue(mockUser);
                groupDAO.create = jest.fn().mockResolvedValue(mockGroup);

                const result = await GroupService.addGroup(groupName, userId);

                expect(result).toEqual({
                    id: mockGroup._id,
                    name: mockGroup.name
                });
                expect(mockGroup.owner).toEqual(userId);
                expect(mockUser.groups.includes(mockGroup._id)).toBe(true);
            } catch (error) {}
        });
    });
})