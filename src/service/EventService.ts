import { EventDAO } from "../dao/EventDAO";
import { CreateEventRequest } from "../dto/request/CreateEventRequest";
import { CreateEventResponse } from "../dto/response/CreateEventResponse";

export class EventService {
    private eventDAO: EventDAO;

    constructor(eventDAO: EventDAO) {
        this.eventDAO = eventDAO;
    }

    public async addEvent(
        createEventRequest: CreateEventRequest,
    ): Promise<CreateEventResponse> {
        const event = await this.eventDAO.create(createEventRequest);

        // Add event into user's event list

        const createEventResponse: CreateEventResponse =
            CreateEventResponse.fromDocument(event);
        return createEventResponse;
    }
}
