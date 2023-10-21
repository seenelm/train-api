import jwt from "jsonwebtoken";
import jwtToken from "../../src/utils/jwtToken";

const payload = {
  name: "Albert Einstein",
  id: 123,
};

describe("Sign Token", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("should generate a valid token", async () => {
    const mockToken = "MockToken123";
    jest.spyOn(jwt, "sign").mockImplementation((payload, secret, callback) => {
      callback(null, mockToken);
    });

    const token = await jwtToken.sign(payload);
    expect(token).toBe(mockToken);
  });
  test("should reject with an error", async () => {
    const mockError = new Error("Creating token failed");
    jest.spyOn(jwt, "sign").mockImplementation((payload, secret, callback) => {
      callback(mockError);
    });

    await expect(jwtToken.sign(payload)).rejects.toThrow(mockError);
  });
});
