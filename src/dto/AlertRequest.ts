export default class AlertRequest {
    private alerts: Date[];
    private isCompleted: boolean;

    public constructor(alerts: Date[], isCompleted: boolean) {
        this.alerts = alerts;
        this.isCompleted = isCompleted;
    }

    public getAlerts(): Date[] {
        return this.alerts;
    }

    public getIsCompleted(): boolean {
        return this.isCompleted;
    }

    public setAlerts(alerts: Date[]): void {
        this.alerts = alerts;
    }

    public setIsCompleted(isCompleted: boolean): void {
        this.isCompleted = isCompleted;
    }
}
