export default class UpdateUserEventStatusRequest {
    private eventId: string;
    private userId: string;
    private status: number;

    constructor(eventId: string, userId: string, status: number) {
        this.eventId = eventId;
        this.userId = userId;
        this.status = status;
    }

    public getEventId(): string {
        return this.eventId;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getStatus(): number {
        return this.status;
    }
}
