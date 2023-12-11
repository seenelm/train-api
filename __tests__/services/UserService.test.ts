import { Types } from "mongoose";
import UserDAO from "../../src/dataAccess/UserDAO";
import UserService from "../../src/services/UserService";
import * as Errors from "../../src/utils/errors";
import { User, IUser } from "../../src/models/userModel";

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

const mockUser1 = {
    _id: new Types.ObjectId(), 
    name: "Lionel Messi", 
    username: "lMessi", 
    password: "Password123!",
    bio: ""
} as IUser
  
const mockUser2 = {
    _id: new Types.ObjectId(), 
    name: "Lionel Messi", 
    username: "lMessi2", 
    password: "Password123!",
    bio: ""
} as IUser

describe("UserService", () => {
    let userDAO: UserDAO;
    let userService: UserService;

    beforeAll(() => {
        jest.mock("../../src/dataAccess/UserDAO");
        userService = new UserService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchGroups", () => {
        it("should return user groups", async () => {
            try {
                userDAO.findUserById = jest.fn().mockResolvedValue(mockUserWithGroups);

                const result = await userService.fetchGroups(USER_ID);

                expect(userDAO.findUserById).toHaveBeenCalledWith(mockUserWithGroups);
                expect(result.userGroups).toEqual(mockUserGroups);  
            } catch (error) {}  
        }); 
        it("should throw a ResourceNotFoundError when user is not found", async () => {
            try {
                userDAO.findUserById = jest.fn().mockResolvedValue(null);

                await expect(userService.fetchGroups(USER_ID)).rejects.toThrow(Errors.ResourceNotFoundError);
            } catch (error) {}
        });   
    });

    describe("findUsers", () => {
        it("should find users", async () => {
            const mockUsers = [ mockUser1, mockUser2 ];
            const mockQuery = "lMessi";

            const mockUsersList = [
                { username: mockUser1.username, name: mockUser1.name },
                { username: mockUser2.username, name: mockUser2.name },
            ]
            
            try {
                userDAO.searchUsers = jest.fn().mockReturnValue(mockUsers);

                const result = await userService.findUsers(mockQuery);
                expect(result).toEqual(mockUsersList);
                expect(userDAO.searchUsers).toHaveBeenCalledWith(mockQuery);
            } catch (error) {}
        });
        it("should throw a BadRequestError when query string is empty", async () => {
            const mockQuery = ""

            try {
                const result = await userService.findUsers(mockQuery);
                expect(result).rejects.toThrow(Errors.BadRequestError);
            } catch (error) {}
        });
        it("should throw a BadRequestError when query object is empty", async () => {
           
            try {
                const result = await userService.findUsers({});
                expect(result).rejects.toThrow(Errors.BadRequestError);
            } catch (error) {}
        });
        it("should throw a ResourceNotFoundError when users are not found", async () => {
            const mockQuery = "lMessi";

            try {
                userDAO.searchUsers = jest.fn().mockReturnValue(null);

                const result = await userService.findUsers(mockQuery);

                expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                expect(userDAO.searchUsers).toBeNull();
            } catch (error) {}
        });

        describe("updateUserBio", () => {
            const mockUser3 = {
                _id: new Types.ObjectId(), 
                name: "Lionel Messi", 
                username: "lMessi2", 
                password: "Password123!",
                bio: "I love to play soccer!"
            } as IUser

            it("should add user bio", async () => {
                const mockUserBio = "I love to play soccer!";

                try {
                    userDAO.findById = jest.fn().mockReturnValue(mockUser1);
                    const userInstance = new User(mockUser1);
                    
                    const result = await userService.updateUserBio(USER_ID, mockUserBio);

                    expect(userInstance.setBio).toHaveBeenCalledWith(mockUserBio)
                    expect(mockUser1.bio).toEqual(mockUserBio);
                } catch (error) {}
            });
            it("should update user bio", async () => {
                const mockUserBio = "I love to play soccer and watch movies!";

                try {
                    userDAO.findById = jest.fn().mockReturnValue(mockUser3);
                    const userInstance = new User(mockUser3);
                    
                    const result = await userService.updateUserBio(USER_ID, mockUserBio);

                    expect(userInstance.setBio).toHaveBeenCalledWith(mockUserBio)
                    expect(mockUser3.bio).toEqual(mockUserBio);
                } catch (error) {}
            });
            it("should throw a ResourceNotFoundError when user does not exist", async () => {
                const mockUserBio = "I love to play soccer and watch movies!";

                try {
                    userDAO.findById = jest.fn().mockReturnValue(null);
    
                    const result = await userService.updateUserBio(USER_ID, mockUserBio);
    
                    expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                    expect(userDAO.findById).toBeNull();
                } catch (error) {}
            });
            it("should throw a BadRequestError if userBio is null", async () => {
                try {
                    const result = await userService.updateUserBio(USER_ID, null);
                    expect(result).rejects.toThrow(Errors.BadRequestError);
                } catch (error) {}
            });
        });

        describe("updateUsersFullName", () => {
            const mockUser = {
                _id: new Types.ObjectId(), 
                name: "Noah Gross", 
                username: "ngross", 
                password: "Password123!",
                bio: "I love to code!"
            } as IUser

            it("should update users name", async () => {
                const mockName = "Noah Shanahan";

                try {
                    userDAO.findById = jest.fn().mockReturnValue(mockUser);
                    const userInstance = new User(mockUser);
                    
                    const result = await userService.updateUsersFullName(USER_ID, mockName);

                    expect(userInstance.setName).toHaveBeenCalledWith(mockName);
                    expect(mockUser.name).toEqual(mockName);
                } catch (error) {}
            });
            it("should throw a ResourceNotFoundError when user does not exist", async () => {
                const mockName = "Noah Shanahan";

                try {
                    userDAO.findById = jest.fn().mockReturnValue(null);
    
                    const result = await userService.updateUsersFullName(USER_ID, mockName);
    
                    expect(result).rejects.toThrow(Errors.ResourceNotFoundError);
                    expect(userDAO.findById).toBeNull();
                } catch (error) {}
            });
            it("should throw a BadRequestError if users name is null", async () => {
                try {
                    const result = await userService.updateUsersFullName(USER_ID, null);
                    expect(result).rejects.toThrow(Errors.BadRequestError);
                } catch (error) {}
            });
        });
    });

});