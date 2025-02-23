export default class UserEventStatusRequest {
    private userId: string;
    private eventStatus: number;

    constructor(userId: string, eventStatus: number) {
        this.userId = userId;
        this.eventStatus = eventStatus;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getEventStatus(): number {
        return this.eventStatus;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    public setEventStatus(eventStatus: number): void {
        this.eventStatus = eventStatus;
    }
}
