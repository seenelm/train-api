export default class UserRegisterRequest {
    private username: string;
    private password: string;
    private name: string;

    private constructor() {}

    static builder() {
        return new this.Builder();
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    static Builder = class {
        private username: string;
        private password: string;
        private name: string;

        public setUsername(username: string): this {
            this.username = username;
            return this;
        }

        public setPassword(password: string): this {
            this.password = password;
            return this;
        }

        public setName(name: string): this {
            this.name = name;
            return this;
        }

        public build(): UserRegisterRequest {
            const userRegisterRequest = new UserRegisterRequest();
            userRegisterRequest.username = this.username;
            userRegisterRequest.password = this.password;
            userRegisterRequest.name = this.name;
            return userRegisterRequest;
        }
    };
}
