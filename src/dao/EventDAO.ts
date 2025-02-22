import BaseDAO from "./BaseDAO";
import { IEvent } from "../model/eventModel";
import { Model } from "mongoose";

export default class EventDAO extends BaseDAO<IEvent> {
    private event: Model<IEvent>;

    constructor(event: Model<IEvent>) {
        super(event);
        this.event = event;
    }

    public async updateEvent(event: IEvent): Promise<void> {}
}
