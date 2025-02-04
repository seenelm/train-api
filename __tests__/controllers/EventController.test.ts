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
import { IEvent } from "../../src/model/eventModel";
import { UserEventResponse } from "../../src/dto/UserEventResponse";
import { EventStatus } from "../../src/common/enums";

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
            const startTime = new Date();
            const endTime = new Date(
                startTime.getTime() + 7 * 24 * 60 * 60 * 1000,
            );

            const mockRequest = {
                body: {
                    name: "Soccer Practice",
                    admin: [new ObjectId()],
                    invitees: [new ObjectId(), new ObjectId()],
                    startTime,
                    endTime,
                    location: "Loudon Soccer Park",
                    description: "Bring your own soccer ball",
                },
            };

            const createEventRequest = new CreateEventRequest.Builder()
                .setName(mockRequest.body.name)
                .setAdmin(mockRequest.body.admin)
                .setInvitees(mockRequest.body.invitees)
                .setStartTime(mockRequest.body.startTime)
                .setEndTime(mockRequest.body.endTime)
                .setLocation(mockRequest.body.location)
                .setDescription(mockRequest.body.description)
                .build();

            const createEventResponse = CreateEventResponse.builder()
                .setId(new ObjectId())
                .setName(createEventRequest.getName())
                .setAdmin(createEventRequest.getAdmin())
                .setInvitees(createEventRequest.getInvitees())
                .setStartTime(createEventRequest.getStartTime())
                .setEndTime(createEventRequest.getEndTime())
                .setLocation(createEventRequest.getLocation())
                .setDescription(createEventRequest.getDescription())
                .build();

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

    describe("getUserEvents", () => {
        it("should return the user's events", async () => {
            const mockUserId = new ObjectId().toString();
            const startTime = new Date();
            const endTime = new Date(
                startTime.getTime() + 7 * 24 * 60 * 60 * 1000,
            );

            const mockRequest = {
                params: {
                    userId: mockUserId,
                },
            } as Partial<Request>;

            const mockEvents: IEvent[] = [
                {
                    _id: new ObjectId(),
                    name: "Soccer Practice",
                    admin: [new ObjectId()],
                    invitees: [new ObjectId(), new ObjectId()],
                    startTime,
                    endTime,
                    location: "Loudoun Soccer Park",
                    description: "Bring your own soccer ball",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as IEvent,
                {
                    _id: new ObjectId(),
                    name: "Basketball Practice",
                    admin: [new ObjectId()],
                    invitees: [new ObjectId(), new ObjectId()],
                    startTime,
                    endTime,
                    location: "Duke University",
                    description: "Practice for upcoming tournament",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as IEvent,
            ];

            const mockUserEvent1 = new UserEventResponse(
                EventStatus.Pending,
                mockEvents[0],
            );
            const mockUserEvent2 = new UserEventResponse(
                EventStatus.Accepted,
                mockEvents[1],
            );
            const mockUserEventResponseList: UserEventResponse[] = [
                mockUserEvent1,
                mockUserEvent2,
            ];

            mockEventService.getUserEvents.mockResolvedValue(
                mockUserEventResponseList,
            );

            // Act
            await eventController.getUserEvents(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction as NextFunction,
            );

            // Assert
            expect(mockEventService.getUserEvents).toHaveBeenCalledWith(
                new ObjectId(mockUserId),
            );
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(
                mockUserEventResponseList,
            );
        });
    });
});
