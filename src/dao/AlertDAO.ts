import BaseDAO from "./BaseDAO";
import { IAlert } from "../model/alertModel";
import { Model } from "mongoose";

export default class AlertDAO extends BaseDAO<IAlert> {
    private alert: Model<IAlert>;

    constructor(alert: Model<IAlert>) {
        super(alert);
        this.alert = alert;
    }
}
