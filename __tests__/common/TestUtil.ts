import UserRegisterRequest from "../../src/dto/UserRegisterRequest";
import UserLoginRequest from "../../src/dto/UserLoginRequest";

export default class TestUtil {
    public static DEFAULT_USERNAME: string = "testUser";
    public static DEFAULT_PASSWORD: string = "testPassword";
    public static DEFAULT_NAME: string = "testName";

    static createUserRegisterRequest(): UserRegisterRequest {
        return UserRegisterRequest.builder()
            .setUsername(this.DEFAULT_USERNAME)
            .setPassword(this.DEFAULT_PASSWORD)
            .setName(this.DEFAULT_NAME)
            .build();
    }

    static createUserLoginRequest(): UserLoginRequest {
        return new UserLoginRequest(
            this.DEFAULT_USERNAME,
            this.DEFAULT_PASSWORD,
        );
    }
}
