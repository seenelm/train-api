import Agenda from "agenda";
import mongoose from "mongoose";
import { EventResponse } from "../../dto/EventResponse";
import { AlertModel } from "../../model/alertModel";
import { Event } from "../../model/eventModel";

export default class AgendaService {
    private agenda: Agenda;

    constructor(agenda: Agenda) {
        this.agenda = agenda;
    }

    public async start(): Promise<void> {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection is not established");
        }
        await this.agenda.start();
    }

    public async stop(): Promise<void> {
        await this.agenda.stop();
    }

    public async cancelEventAlerts(eventId: string) {
        await this.agenda.cancel({ "data.eventId": eventId });
    }

    public async scheduleNotification(event: EventResponse) {
        const alerts = await AlertModel.findById(event.getAlerts());
        if (!alerts) {
            console.error("Alerts not found");
            return;
        }

        for (const alert of alerts.alerts) {
            const scheduledTime = event.getStartTime();
            scheduledTime.setMinutes(
                scheduledTime.getMinutes() - alert.getMinutes(),
            );

            if (scheduledTime > new Date()) {
                const jobId = `alert-event-${event.getId()}-${alert.getMinutes()}`;

                await this.agenda.schedule(
                    scheduledTime,
                    "send push notification",
                    {
                        eventId: event.getId(),
                        alert,
                        title: event.getName(),
                    },
                );
            }
        }
    }

    public defineJobs(): void {
        this.agenda.define("send push notification", async (job) => {
            const { eventId, scheduledTime, title } = job.attrs.data;
            try {
                const event = (await Event.findById(eventId)).populated(
                    "invitees",
                );
                if (!event) {
                    console.error("Event not found");
                    return;
                }

                const invitees = event.invitees;
                const deviceTokens = invitees.map(
                    (invitee) => invitee.deviceToken,
                );

                if (deviceTokens.length === 0) {
                    console.error("No device tokens found");
                    return;
                }

                const message = {
                    notification: {
                        title,
                        body: `Event starts in ${scheduledTime} minutes`,
                    },
                    tokens: deviceTokens,
                };

                const response = await admin
                    .messaging()
                    .sendEachForMulticast(message);
                console.log(
                    `Sent reminders for event ${event.title}. Success: ${response.successCount}, Failure: ${response.failureCount}`,
                );

                if (response.failureCount > 0) {
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            console.error(
                                `Failed to send notification to token: ${deviceTokens[idx]}, Error:`,
                                resp.error,
                            );
                        }
                    });
                }
            } catch (error) {
                console.error("Error sending notification:", error);
                throw error;
            }
        });
    }
}
