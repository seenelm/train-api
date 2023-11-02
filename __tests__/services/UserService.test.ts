import { Types } from "mongoose";
import UserDAO from "../../src/dataAccess/UserDAO";
import UserService from "../../src/services/UserService";
import * as Errors from "../../src/utils/errors";

const USER_ID = new Types.ObjectId();

const mockUserWithGroups = {
    _id: new Types.ObjectId(),
    name: "Noah Gross",
    username: "ngross",
    password: "Password98!",
    groups: [
        {
            _id: new Types.ObjectId(),
            name: "Maryland Football",
            users: [],
            owner: new Types.ObjectId(),
            requests: []
        },
        {
            _id: new Types.ObjectId(),
            name: "The Shop Gym",
            users: [],
            owner: new Types.ObjectId(),
            requests: []
        }
    ],
}

const mockUserGroups = [
    { _id: new Types.ObjectId(), name: "Maryland Football"}, 
    { _id: new Types.ObjectId(), name: "The Shop Gym"},
]

jest.mock("../../src/dataAccess/UserDAO");

describe("UserService", () => {
    let userDAO: UserDAO;

    describe("fetchGroups", () => {

        it("should return user groups", async () => {
            try {
                userDAO.findUserById = jest.fn().mockResolvedValue(mockUserWithGroups);

                const result = await UserService.fetchGroups(USER_ID);

                expect(userDAO.findUserById).toHaveBeenCalledWith(mockUserWithGroups);
                expect(result.userGroups).toEqual(mockUserGroups);  
            } catch (error) {}
        }); 
        it("should throw a ResourceNotFoundError when user is not found", async () => {
            try {
                userDAO.findUserById = jest.fn().mockResolvedValue(null);

                await expect(UserService.fetchGroups(USER_ID)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });   
    });

});