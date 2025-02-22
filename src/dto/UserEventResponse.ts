import { UserEventEntity } from "../entity/UserEventEntity";
import { IUserEvent } from "../model/userEventModel";
import { EventResponse } from "./EventResponse";
import { IEvent } from "../model/eventModel";

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

    public static fromUserEvent(userEvent: IUserEvent): UserEventResponse {
        const event = userEvent.events[0] as Partial<IEvent>;

        return new UserEventResponse(
            userEvent.events[0].status,
            EventResponse.from(event),
        );
    }
}
