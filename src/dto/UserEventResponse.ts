import { IEvent } from "../model/eventModel";
import { UserEventEntity } from "../entity/UserEventEntity";

export class UserEventResponse {
    private status: number;
    private event: IEvent;

    constructor(status: number, event: IEvent) {
        this.status = status;
        this.event = event;
    }

    public setStatus(status: number): void {
        this.status = status;
    }

    public getStatus(): number {
        return this.status;
    }

    public setEvent(event: IEvent): void {
        this.event = event;
    }

    public getEvent(): IEvent {
        return this.event;
    }

    public static from(
        userEventEntityList: UserEventEntity[],
    ): UserEventResponse[] {
        return userEventEntityList.map(
            (userEventEntity) =>
                new UserEventResponse(
                    userEventEntity.getStatus(),
                    userEventEntity.getEvent(),
                ),
        );
    }
}
