import { Request, Response, NextFunction } from "express";
import {
  authenticate,
  getAccessToken,
} from "../../src/__middleware__/authenticate";
import { UnauthorizedError } from "../../src/utils/errors";
import { UserModel } from "../../src/models/userModel";
import { Types } from "mongoose";
import JWTUtil from "../../src/utils/JWTUtil";
import { TokenPayload } from "../../src/services/UserService";
import { IUser } from "../../src/models/userModel";
import * as jwt from "jsonwebtoken";

jest.mock("../../src/utils/JWTUtil");
jest.mock("../../src/models/userModel");

describe("getAccessToken", () => {
  it("should return the token if the authorization header is valid", () => {
    const token = getAccessToken("Bearer validToken");
    expect(token).toEqual("validToken");
  });

  it("should throw an UnauthorizedError if the authorization header is invalid", () => {
    expect(() => getAccessToken("")).toThrow(UnauthorizedError);
  });

  it("should throw an UnauthorizedError if there is no authorization header", () => {
    try {
      getAccessToken("validToken");
    } catch (error) {
      const err = error as UnauthorizedError;
      expect(err.message).toEqual("Invalid Authorization");
      expect(err).toBeInstanceOf(UnauthorizedError);
      expect(err.statusCode).toEqual(401);
    }
  });

  it("should throw an UnauthorizedError if the token is missing", () => {
    expect(() => getAccessToken("Bearer")).toThrow(UnauthorizedError);
  });
});

describe("authenticate middleware", () => {
  let token: string;

  const mockRequest = (headers: any) =>
    ({
      headers,
      user: null,
    } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next: NextFunction = jest.fn();

  beforeEach(() => {
    token = "validToken";

    jest.mock("../../src/__middleware__/authenticate", () => ({
      ...jest.requireActual("../../src/__middleware__/authenticate"),
      getAccessToken: jest.fn().mockReturnValue(token),
    }));
  });

  it("should authenticate the user if the token is valid", async () => {
    const mockUserId = new Types.ObjectId();
    const mockDecodedToken = { userId: mockUserId, name: "validName" };
    const mockPayload = mockDecodedToken as TokenPayload;
    const mockPayloadUserId = mockPayload.userId;

    const mockUser = {
      _id: mockUserId,
      username: "validUsername",
      password: "validPassword",
      isActive: true,
    } as IUser;

    JWTUtil.verify = jest.fn().mockResolvedValue(mockDecodedToken);
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);

    const req = mockRequest({ authorization: "Bearer validToken" });
    const res = mockResponse();

    await authenticate(req, res, next);

    expect(JWTUtil.verify).toHaveBeenCalledWith(token, process.env.SECRET_CODE);
    expect(UserModel.findById).toHaveBeenCalledWith(mockPayloadUserId);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
  });

  it("should throw an UnauthorizedError if the token is invalid", async () => {
    const mockUserId = new Types.ObjectId();
    const mockDecodedToken = { userId: mockUserId, name: "validName" };
    const mockPayload = mockDecodedToken as TokenPayload;
    const mockPayloadUserId = mockPayload.userId;

    const mockUser = {
      _id: mockUserId,
      username: "validUsername",
      password: "validPassword",
      isActive: true,
    } as IUser;

    JWTUtil.verify = jest.fn().mockRejectedValue(new Error("Invalid token"));

    const req = mockRequest({ authorization: "Bearer validToken" });
    const res = mockResponse();

    try {
      await authenticate(req, res, next);
    } catch (error) {
      console.log("Error: ", error);
      const err = error as UnauthorizedError;
      expect(err.message).toEqual("Invalid token");
      expect(err).toBeInstanceOf(UnauthorizedError);
      expect(err.statusCode).toEqual(401);
    }
  });
});
