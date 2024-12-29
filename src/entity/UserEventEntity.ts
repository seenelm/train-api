import { IEvent } from "../model/eventModel";

export class UserEventEntity {
    private status: string;
    private event: IEvent;

    constructor(status: string, event: IEvent) {
        this.status = status;
        this.event = event;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public getStatus(): string {
        return this.status;
    }

    public setEvent(event: IEvent): void {
        this.event = event;
    }

    public getEvent(): IEvent {
        return this.event;
    }
}
