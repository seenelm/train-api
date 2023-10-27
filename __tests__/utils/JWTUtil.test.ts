import JWTUtil from "../../src/utils/JWTUtil";

jest.mock("../../src/utils/JWTUtil");

describe("JWTUtil", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("Sign Token", () => {
    it("should generate a valid token", async () => {
      const mockToken = "MockToken123";
      const secret = "secretCode";

      const payload = {
        name: "Albert Einstein",
        id: 123,
      };
      
      JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

      const token = await JWTUtil.sign(payload, secret);
      expect(token).toBe(mockToken);
    });
    it("should reject with an error", async () => {
      const mockError = new Error("Creating token failed");
      const secret = "secretCode";

      const payload = {
        name: "Albert Einstein",
        id: 123,
      };
      
      JWTUtil.sign = jest.fn().mockRejectedValue(mockError);

      await expect(JWTUtil.sign(payload, secret)).rejects.toThrow(mockError);
    });
  });
  describe("Verify Token", () => {
    it("should return decoded payload", async () => {
      const token = "MockToken123";
      const secret = "secretCode";

      const mockDecoded = {
        name: "Albert Einstein",
        id: 123,
      }

      jest.spyOn(JWTUtil, "verify").mockResolvedValue(mockDecoded);

      const decoded = await JWTUtil.verify(token, secret);
      expect(decoded).toBeDefined();
      expect(decoded).toEqual(mockDecoded);
    });
    it("should return an error", async () => {
      const token = "MockToken123";
      const secret = "secretCode";
      const mockError = new Error("Error verifying token");

      jest.spyOn(JWTUtil, "verify").mockRejectedValue(mockError);

      await expect(JWTUtil.verify(token, secret)).rejects.toThrow(mockError);
    });
  });
});
