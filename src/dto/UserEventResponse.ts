import { UserEventEntity } from "../entity/UserEventEntity";
import { EventResponse } from "./EventResponse";

export class UserEventResponse {
    private status: number;
    private event: EventResponse;

    constructor(status: number, event: EventResponse) {
        this.status = status;
        this.event = event;
    }

    public setStatus(status: number): void {
        this.status = status;
    }

    public getStatus(): number {
        return this.status;
    }

    public setEvent(event: EventResponse): void {
        this.event = event;
    }

    public getEvent(): EventResponse {
        return this.event;
    }

    public static from(
        userEventEntityList: UserEventEntity[],
    ): UserEventResponse[] {
        return userEventEntityList.map(
            (userEventEntity) =>
                new UserEventResponse(
                    userEventEntity.getStatus(),
                    EventResponse.from(userEventEntity.getEvent()),
                ),
        );
    }
}
