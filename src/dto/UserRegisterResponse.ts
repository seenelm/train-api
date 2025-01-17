export default class UserRegisterResponse {
    private userId: string;
    private token: string;
    private username: string;
    private name: string;

    private constructor() {}

    static builder() {
        return new this.Builder();
    }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    public getToken(): string {
        return this.token;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    static Builder = class {
        private userId: string;
        private token: string;
        private username: string;
        private name: string;

        public setUserId(userId: string): this {
            this.userId = userId;
            return this;
        }

        public setToken(token: string): this {
            this.token = token;
            return this;
        }

        public setUsername(username: string): this {
            this.username = username;
            return this;
        }

        public setName(name: string): this {
            this.name = name;
            return this;
        }

        public build(): UserRegisterResponse {
            const userRegisterResponse = new UserRegisterResponse();
            userRegisterResponse.userId = this.userId;
            userRegisterResponse.token = this.token;
            userRegisterResponse.username = this.username;
            userRegisterResponse.name = this.name;
            return userRegisterResponse;
        }
    };
}
