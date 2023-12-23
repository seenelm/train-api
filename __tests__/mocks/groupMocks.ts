import { Types } from "mongoose";
import { IGroup } from "../../src/models/groupModel";
import { IUserGroups } from "../../src/models/userGroups";
import { IUser } from "../../src/models/userModel";

const mockUserId = new Types.ObjectId();
const mockGroupID = new Types.ObjectId();
const mockGroupOneID = new Types.ObjectId();
const mockGroupTwoID = new Types.ObjectId();

export const mockUser = {
    _id: mockUserId,
    username: "ngross",
    password: "Password123!",
    isActive: true,
} as IUser

export const mockOwnerId = mockUser._id;

// Doesn't have a bio.
export const mockGroup = {
    _id: mockGroupID,
    name: "Baltimore Ravens",
    owners: [mockOwnerId],
    users: new Types.DocumentArray<IUser>([]),
    requests: new Types.DocumentArray<IUser>([])
} as IGroup

export const mockGroup1 = {
    _id: mockGroupOneID,
    name: "Maryland Basketball",
    bio: "We are going to win the NCAA Championship!!",
    owners: [mockOwnerId],
    users: new Types.DocumentArray<IUser>([]),
    requests: new Types.DocumentArray<IUser>([])
} as IGroup

export const mockGroup2 = {
    _id: mockGroupTwoID,
    name: "Heritage Basketball",
    bio: "We are going to States this year!!",
    owners: [mockOwnerId],
    users: new Types.DocumentArray<IUser>([]),
    requests: new Types.DocumentArray<IUser>([])
} as IGroup

export const mockUserGroups = {
    _id: new Types.ObjectId(),
    userId: mockUser._id,
    groups: [mockGroup1._id, mockGroup2._id]
} as IUserGroups