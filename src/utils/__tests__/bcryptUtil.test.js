const bcrypt = require("bcrypt");
const bcryptUtil = require("../bcryptUtil");

const mockPassword = "Password123!";

describe("hashPassword", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("should generate a hashed password", async () => {
    const mockHash = "Password123!Hash";
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementation((password, salt, callback) => {
        callback(null, mockHash);
      });

    const hash = await bcryptUtil.hashPassword(mockPassword);
    expect(hash).toBe(mockHash);
  });
  test("should reject with an error", async () => {
    const mockError = new Error("Error Hashing Password");
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementation((password, salt, callback) => {
        callback(mockError);
      });

    await expect(bcryptUtil.hashPassword(mockPassword)).rejects.toThrow(
      mockError
    );
  });
});
