import EventService from "../../src/service/EventService";
import { CreateEventResponse } from "../../src/dto/CreateEventResponse";
import { ObjectId } from "mongodb";
import { CreateEventRequest } from "../../src/dto/CreateEventRequest";
import { EventController } from "../../src/controller/EventController";
import EventDAO from "../../src/dao/EventDAO";
import UserEventDAO from "../../src/dao/UserEventDAO";
import { Event } from "../../src/model/eventModel";
import { UserEvent } from "../../src/model/userEventModel";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

jest.mock("../../src/service/EventService");

describe("EventController", () => {
    let eventController: EventController;
    let mockEventService: jest.Mocked<EventService>;
    let mockEventDAO: jest.Mocked<EventDAO>;
    let mockUserEventDAO: jest.Mocked<UserEventDAO>;
    let mockResponse: Partial<Response>;
    let mockNextFunction: Partial<NextFunction>;

    beforeEach(() => {
        mockEventDAO = new EventDAO(Event) as jest.Mocked<EventDAO>;
        mockUserEventDAO = new UserEventDAO(
            UserEvent,
        ) as jest.Mocked<UserEventDAO>;
        mockEventService = new EventService(
            mockEventDAO,
            mockUserEventDAO,
        ) as jest.Mocked<EventService>;
        eventController = new EventController(mockEventService);

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNextFunction = {
            next: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("addEvent", () => {
        it("should return 201 and the created event", async () => {
            // Arrange
            const date = "2024-12-25";
            const startTime = "12:00";
            const endTime = "14:00";

            const mockRequest = {
                body: {
                    name: "Soccer Practice",
                    admin: [new ObjectId()],
                    invitees: [new ObjectId(), new ObjectId()],
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    location: "Loudon Soccer Park",
                    description: "Bring your own soccer ball",
                },
            };

            const createEventRequest = new CreateEventRequest.Builder()
                .setName(mockRequest.body.name)
                .setAdmin(mockRequest.body.admin)
                .setInvitees(mockRequest.body.invitees)
                .setDate(new Date(mockRequest.body.date))
                .setStartTime(new Date(mockRequest.body.startTime))
                .setEndTime(new Date(mockRequest.body.endTime))
                .setLocation(mockRequest.body.location)
                .setDescription(mockRequest.body.description)
                .build();

            const createEventResponse = new CreateEventResponse(
                new ObjectId(),
                createEventRequest.getName(),
                createEventRequest.getAdmin(),
                createEventRequest.getInvitees(),
                createEventRequest.getDate(),
                createEventRequest.getStartTime(),
                createEventRequest.getEndTime(),
                createEventRequest.getLocation(),
                createEventRequest.getDescription(),
            );

            mockEventService.addEvent.mockResolvedValue(createEventResponse);

            // Act
            await eventController.addEvent(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction as NextFunction,
            );

            // Assert
            expect(mockEventService.addEvent).toHaveBeenCalledWith(
                createEventRequest,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(
                HttpStatusCode.CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledWith(createEventResponse);
        });
    });
});
