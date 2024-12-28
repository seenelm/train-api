import { ObjectId } from "mongodb";
import { IEvent } from "../model/eventModel";
import { UserEventEntity } from "../entity/UserEventEntity";

export class UserEventResponse {
    private userId: ObjectId;
    private eventStatus: string;
    private event: IEvent;

    constructor(userId: ObjectId, eventStatus: string, event: IEvent) {
        this.userId = userId;
        this.eventStatus = eventStatus;
        this.event = event;
    }

    public setUserId(userId: ObjectId): void {
        this.userId = userId;
    }

    public getUserId(): ObjectId {
        return this.userId;
    }

    public setEventStatus(eventStatus: string): void {
        this.eventStatus = eventStatus;
    }

    public getEventStatus(): string {
        return this.eventStatus;
    }

    public setEvent(event: IEvent): void {
        this.event = event;
    }

    public getEvent(): IEvent {
        return this.event;
    }

    public static from(userEventEntity: UserEventEntity): UserEventResponse {
        return new UserEventResponse(
            userEventEntity.getUserId(),
            userEventEntity.getEventStatus(),
            userEventEntity.getEvent(),
        );
    }
}
