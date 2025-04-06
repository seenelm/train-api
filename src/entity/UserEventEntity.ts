import { IEvent } from "../model/eventModel";

export class UserEventEntity {
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
}
