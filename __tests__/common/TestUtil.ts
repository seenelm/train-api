import UserRegisterRequest from "../../src/dto/UserRegisterRequest";
import UserLoginRequest from "../../src/dto/UserLoginRequest";
import UserLoginResponse from "../../src/dto/UserLoginResponse";
import UserRegisterResponse from "../../src/dto/UserRegisterResponse";
import { ObjectId } from "mongodb";

export default class TestUtil {
    public static USERNAME: string = "testUser";
    public static PASSWORD: string = "testPassword";
    public static NAME: string = "testName";

    public static USER_ID: string = new ObjectId().toString();
    public static TOKEN: string = "token";

    static createUserRegisterRequest(): UserRegisterRequest {
        return UserRegisterRequest.builder()
            .setUsername(this.USERNAME)
            .setPassword(this.PASSWORD)
            .setName(this.NAME)
            .build();
    }

    static createUserLoginRequest(): UserLoginRequest {
        return new UserLoginRequest(this.USERNAME, this.PASSWORD);
    }

    static createUserRegisterResponse(): UserRegisterResponse {
        return UserRegisterResponse.builder()
            .setUserId(this.USER_ID)
            .setToken(this.TOKEN)
            .setUsername(this.USERNAME)
            .setName(this.NAME)
            .build();
    }

    static createUserLoginResponse(): UserLoginResponse {
        return UserLoginResponse.builder()
            .setUserId(this.USER_ID)
            .setToken(this.TOKEN)
            .setUsername(this.USERNAME)
            .setName(this.NAME)
            .build();
    }
}
