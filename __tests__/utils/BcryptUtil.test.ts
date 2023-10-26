import BcryptUtil from "../../src/utils/BcryptUtil";

jest.mock("../../src/utils/BcryptUtil");

describe("BcryptUtil", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("hashPassword", () => {
    it("should generate a hashed password", async () => {
      const mockPassword = "Password123!";
      const mockHashedPassword = "hashPassword123!";

      BcryptUtil.hashPassword = jest.fn().mockResolvedValue(mockHashedPassword);
      
      const hashedPassword = await BcryptUtil.hashPassword(mockPassword);

      expect(hashedPassword).toBe(mockHashedPassword);
    });
    test("should reject with an error", async () => {
      const mockPassword = "";
      const mockError = new Error("Invalid Password");

      BcryptUtil.hashPassword = jest.fn().mockRejectedValue(mockError);

      await expect(BcryptUtil.hashPassword(mockPassword)).rejects.toThrow(mockError);
    });
  });
  describe("comparePassword", () => {
    it("should return true", async () => {
      const mockInputPassword = "Password123!";
      const mockHashedPassword = "Password123!";

      BcryptUtil.comparePassword = jest.fn().mockResolvedValue(true);

      const isMatch = await BcryptUtil.comparePassword(mockInputPassword, mockHashedPassword);
      expect(isMatch).toBe(true);
    });
    it("should return false", async () => {
      const mockInputPassword = "Password123!";
      const mockHashedPassword = "mockPassword";

      BcryptUtil.comparePassword = jest.fn().mockResolvedValue(false);

      const isMatch = await BcryptUtil.comparePassword(mockInputPassword, mockHashedPassword);
      expect(isMatch).toBe(false);
    });
    it("should throw an error", async () => {
      const mockInputPassword = "Password123!";
      const mockHashedPassword = "mockPassword";
      const mockError = new Error("Passwords do not match");

      BcryptUtil.comparePassword = jest.fn().mockRejectedValue(mockError);

      await expect(BcryptUtil.comparePassword(mockInputPassword, mockHashedPassword)).rejects.toThrow(mockError);
    });
  });
});
