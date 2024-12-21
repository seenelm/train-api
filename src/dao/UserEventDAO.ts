import BaseDAO from "./BaseDAO";
import { IUserEvent } from "../model/userEventModel";
import { Model } from "mongoose";

export class UserEventDAO extends BaseDAO<IUserEvent> {
    private userEvent: Model<IUserEvent>;

    constructor(userEvent: Model<IUserEvent>) {
        super(userEvent);
        this.userEvent = userEvent;
    }
}
