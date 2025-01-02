import EventDAO from "../../src/dao/EventDAO";
import UserEventDAO from "../../src/dao/UserEventDAO";
import EventService from "../../src/service/EventService";
import mongoose, { ClientSession, Error as MongooseError } from "mongoose";
import { CreateEventRequest } from "../../src/dto/CreateEventRequest";
import { Event } from "../../src/model/eventModel";
import { UserEvent } from "../../src/model/userEventModel";
import { CreateEventResponse } from "../../src/dto/CreateEventResponse";
import { DatabaseError } from "../../src/utils/errors";
import { MongoServerError } from "mongodb";

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

    describe("addEvent", () => {
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
            expect(mockEventDAO.create).toHaveBeenCalledWith(
                createEventRequest,
                {
                    session: mockSession,
                },
            );
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

        it("should abort transaction if event creation fails", async () => {
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

            mockEventDAO.create.mockRejectedValue(
                new MongooseError.ValidationError(),
            );

            // Act
            await expect(
                eventService.addEvent(createEventRequest),
            ).rejects.toThrow(DatabaseError);

            // Assert
            expect(mockEventDAO.create).toHaveBeenCalledWith(
                createEventRequest,
                {
                    session: mockSession,
                },
            );
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should abort transaction if upsertAdminEvents fails", async () => {
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
            mockUserEventDAO.findOneAndUpdate.mockImplementationOnce(() => {
                throw new Error("Error upserting admin events");
            });

            // Act
            await expect(
                eventService.addEvent(createEventRequest),
            ).rejects.toThrow(DatabaseError);

            // Assert
            expect(mockEventDAO.create).toHaveBeenCalledWith(
                createEventRequest,
                {
                    session: mockSession,
                },
            );
            expect(mockUserEventDAO.findOneAndUpdate).toHaveBeenCalledTimes(3);
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should abort transaction if upsertInviteeEvents fails", async () => {
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
            mockUserEventDAO.findOneAndUpdate.mockResolvedValueOnce(null); // Successfully upsert admin events
            mockUserEventDAO.findOneAndUpdate.mockImplementationOnce(() => {
                throw new Error("Error upserting invitee events");
            });

            // Act
            await expect(
                eventService.addEvent(createEventRequest),
            ).rejects.toThrow(DatabaseError);

            // Assert
            expect(mockEventDAO.create).toHaveBeenCalledWith(
                createEventRequest,
                {
                    session: mockSession,
                },
            );
            expect(mockUserEventDAO.findOneAndUpdate).toHaveBeenCalledTimes(3);
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should handle MongoDB duplicate key error", async () => {
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

            const duplicateKeyError = new MongoServerError({
                code: 11000,
                message: "Duplicate key error",
            });

            mockEventDAO.create.mockRejectedValue(duplicateKeyError);

            // Act
            await expect(
                eventService.addEvent(createEventRequest),
            ).rejects.toThrow(DatabaseError);

            // Assert
            expect(mockEventDAO.create).toHaveBeenCalledWith(
                createEventRequest,
                {
                    session: mockSession,
                },
            );
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });

    describe("getUserEvents", () => {
        it("should successfully return user events", async () => {});

        it("should throw ResourceNotFoundError if no events are found", async () => {});

        it("should handle database errors", async () => {});
    });
});
