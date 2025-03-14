import admin from "../firebase";

export default class NotificationService {
    private admin: admin.app.App;

    constructor(admin: admin.app.App) {
        this.admin = admin;
    }

    sendNotification = async (message: admin.messaging.Message) => {
        try {
            await this.admin.messaging().send(message);
        } catch (error) {
            throw error;
        }
    };
}
