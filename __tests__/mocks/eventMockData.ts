import { ObjectId } from "mongodb";
import { IEvent } from "../../src/model/eventModel";
import { CreateEventRequest } from "../../src/dto/CreateEventRequest";
import { IUser } from "../../src/model/userModel";
import { IUserProfile } from "../../src/model/userProfile";
import { faker } from "@faker-js/faker";

export const soccerPracticeEvent: IEvent = {
    _id: new ObjectId(),
    name: "Soccer Practice",
    admin: [new ObjectId()],
    invitees: [new ObjectId(), new ObjectId()],
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: "Loudoun Soccer Park",
    description: "Practice for upcoming tournament",
    createdAt: new Date(),
    updatedAt: new Date(),
} as IEvent;

export const getCreateEventRequest = (): CreateEventRequest => {
    return CreateEventRequest.builder()
        .setName("Soccer Practice")
        .setAdmin([new ObjectId()])
        .setInvitees([new ObjectId(), new ObjectId()])
        .setDate(new Date())
        .setStartTime(new Date())
        .setEndTime(new Date())
        .setLocation("Loudoun Soccer Park")
        .setDescription("Practice for upcoming tournament")
        .build();
};

export const createMockUser = (overrides?: Partial<IUser>): IUser => {
    return {
        _id: new ObjectId(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        isActive: faker.datatype.boolean(),
        ...overrides,
    } as IUser;
};

export const createMockUserProfile = (
    user: IUser,
    overrides?: Partial<IUserProfile>,
): IUserProfile => {
    return {
        _id: new ObjectId(),
        userId: user._id,
        username: user.username,
        name: faker.person.fullName(),
        bio: faker.person.bio(),
        accountType: faker.helpers.arrayElement([1, 2]),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        ...overrides,
    } as IUserProfile;
};

export const createMockCreateEventRequest = (
    admins: ObjectId[],
    invitees: ObjectId[],
    // overrides?: Partial<IEvent>,
): CreateEventRequest => {
    return CreateEventRequest.builder()
        .setName(faker.lorem.words())
        .setAdmin(admins)
        .setInvitees(invitees)
        .setDate(faker.date.future())
        .setStartTime(faker.date.future())
        .setEndTime(faker.date.future())
        .setLocation(faker.location.streetAddress())
        .setDescription(faker.lorem.sentence())
        .build();
    // ...overrides,
};

export const createMockEvent = (
    createEventRequest: CreateEventRequest,
    overrides?: Partial<IEvent>,
): IEvent => {
    return {
        _id: new ObjectId(),
        name: createEventRequest.getName(),
        admin: createEventRequest.getAdmin(),
        invitees: createEventRequest.getInvitees(),
        date: createEventRequest.getDate(),
        startTime: createEventRequest.getStartTime(),
        endTime: createEventRequest.getEndTime(),
        location: createEventRequest.getLocation(),
        description: createEventRequest.getDescription(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        ...overrides,
    } as IEvent;
};
