import EventDAO from "../../src/dao/EventDAO";
import UserEventDAO from "../../src/dao/UserEventDAO";
import EventService from "../../src/service/EventService";
import mongoose, { ClientSession, Error as MongooseError } from "mongoose";
import { CreateEventRequest } from "../../src/dto/CreateEventRequest";
import { Event } from "../../src/model/eventModel";
import { UserEvent } from "../../src/model/userEventModel";
import { CreateEventResponse } from "../../src/dto/CreateEventResponse";
import { DatabaseError, handleMongoDBError } from "../../src/utils/errors";
import { MongoServerErrorType } from "../../src/common/enums";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { ObjectId } from "mongodb";

import {
    createMockUser,
    createMockUserProfile,
    createMockEvent,
    createMockCreateEventRequest,
} from "../mocks/eventMockData";

jest.mock("../../src/dao/EventDAO");
jest.mock("../../src/dao/UserEventDAO");

describe("EventService", () => {
    let eventService: EventService;
    let mockEventDAO: jest.Mocked<EventDAO>;
    let mockUserEventDAO: jest.Mocked<UserEventDAO>;
    let mockSession: jest.Mocked<ClientSession>;

    beforeEach(() => {
        mockEventDAO = new EventDAO(Event) as jest.Mocked<EventDAO>;
        mockUserEventDAO = new UserEventDAO(
            UserEvent,
        ) as jest.Mocked<UserEventDAO>;
        eventService = new EventService(mockEventDAO, mockUserEventDAO);

        mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        } as unknown as jest.Mocked<ClientSession>;

        jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create a new event and update user events", async () => {
        // Arrange
        const admin1 = createMockUser();
        const invitee1 = createMockUser();
        const invitee2 = createMockUser();
        const admin1Profile = createMockUserProfile(admin1);
        const invitee1Profile = createMockUserProfile(invitee1);
        const invitee2Profile = createMockUserProfile(invitee2);

        const createEventRequest: CreateEventRequest =
            createMockCreateEventRequest(
                [admin1Profile._id],
                [invitee1Profile._id, invitee2Profile._id],
            );
        const mockEvent = createMockEvent(createEventRequest);

        mockEventDAO.create.mockResolvedValue(mockEvent);
        mockUserEventDAO.findOneAndUpdate.mockResolvedValue(null);

        // Act
        const createEventResponse: CreateEventResponse =
            await eventService.addEvent(createEventRequest);

        // Assert
        expect(mockEventDAO.create).toHaveBeenCalledWith(createEventRequest, {
            session: mockSession,
        });
        expect(mockUserEventDAO.findOneAndUpdate).toHaveBeenCalledTimes(3);
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(createEventResponse.getId()).toEqual(mockEvent._id);
        expect(createEventResponse.getName()).toEqual(
            createEventRequest.getName(),
        );
        expect(createEventResponse.getAdmin()[0]).toEqual(
            createEventRequest.getAdmin()[0],
        );
        expect(createEventResponse.getInvitees()).toEqual(
            createEventRequest.getInvitees(),
        );
        expect(createEventResponse.getDate()).toEqual(
            createEventRequest.getDate(),
        );
        expect(createEventResponse.getStartTime()).toEqual(
            createEventRequest.getStartTime(),
        );
        expect(createEventResponse.getEndTime()).toEqual(
            createEventRequest.getEndTime(),
        );
        expect(createEventResponse.getLocation()).toEqual(
            createEventRequest.getLocation(),
        );
        expect(createEventResponse.getDescription()).toEqual(
            createEventRequest.getDescription(),
        );
    });

    // it("should handle validation error when creating a new event", async () => {
    //     // Arrange
    //     const createEventRequest: CreateEventRequest = getCreateEventRequest();

    //     eventDAO.create.mockRejectedValue(new MongooseError.ValidationError());

    //     await expect(eventService.addEvent(createEventRequest)).rejects.toThrow(
    //         expect.objectContaining({
    //             message: "Validation failed",
    //             code: "VALIDATION_ERROR",
    //             statusCode: 400,
    //         }),
    //     );
    //     expect(session.abortTransaction).toHaveBeenCalled();
    //     expect(session.endSession).toHaveBeenCalled();
    // });

    // it("should handle cast error during admin upsert", async () => {
    //     // Arrange
    //     // const createEventRequest: CreateEventRequest = getCreateEventRequest();
    //     const createEventRequest: CreateEventRequest =
    //         CreateEventRequest.builder()
    //             .setName("Soccer Practice")
    //             .setAdmin([new ObjectId()])
    //             .setInvitees([])
    //             .setDate(new Date())
    //             .setStartTime(new Date())
    //             .setEndTime(new Date())
    //             .setLocation("Loudoun Soccer Park")
    //             .setDescription("Practice for upcoming tournament")
    //             .build();

    //     const castError = {
    //         name: "CastError",
    //         stringValue: '"invalid-id"',
    //         kind: "ObjectId",
    //         value: "invalid-id",
    //         path: "userId",
    //     } as unknown as MongooseError.CastError;

    //     eventDAO.create.mockResolvedValue(soccerPracticeEvent);
    //     userEventDAO.findOneAndUpdate.mockRejectedValue(castError);

    //     console.log("Create Event Request: ", createEventRequest);

    //     const result = await eventService.addEvent(createEventRequest);
    //     console.log("Result: ", result);

    //     // Act
    //     expect(result).rejects.toThrow(
    //         expect.objectContaining({
    //             message: "Cast error",
    //             code: "CAST_ERROR",
    //             statusCode: 400,
    //         }),
    //     );

    //     // Assert
    //     expect(session.abortTransaction).toHaveBeenCalled();
    //     expect(session.endSession).toHaveBeenCalled();
    //     expect(handleMongoDBError).toHaveBeenCalled();
    // });
});
