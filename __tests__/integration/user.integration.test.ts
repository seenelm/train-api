import request from "supertest";
import { app } from "../../src/app";
import { server } from "../../src/server";
import { Types } from "mongoose";

describe("User Controller Integration Tests", () => {
    let userId: Types.ObjectId;
    let userBio: String;
    let token: String;

    const userData = {
        username: "deadpool",
        password: "Password98!",
        name: "Deadpool"
    }

    afterAll(() => {
        server.close();
    });

    it("should register a user", async () => {

        // Register user.
        const response = await  request(app).post("/api/register").send(userData).expect(201);

        expect(response.body.userId).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.username).toBe(userData.username);

        userId = response.body.userId;
        token = response.body.token;

        // Check user was added by fetching the user.
        const userResponse = await request(app)
            .get(`/api/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201); 
             
        expect(userResponse.body).toEqual({
            _id: userResponse.body._id,
            username: userResponse.body.username,
            isActive: true
        });      
    });

    it("should add a bio to users profile", async () => {
        userBio = "I am going to beat Wolverine in a boxing match!!";
        const updateUserBioResponse = await request(app)
            .put(`/api/user-profile/users/${userId}/bio`)
            .set("Authorization", `Bearer ${token}`)
            .send({ userBio: userBio });

        expect(updateUserBioResponse.status).toBe(201);

        // Get users profile with bio.
        const fetchUserProfile = await request(app)
            .get(`/api/user-profile/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        expect(fetchUserProfile.body._id).toBeDefined();
        expect(fetchUserProfile.body.userId).toEqual(userId);
        expect(fetchUserProfile.body.name).toEqual(userData.name);
        expect(fetchUserProfile.body.accountType).toEqual("1");
        expect(fetchUserProfile.body.bio).toEqual(userBio);
    });

    it("should update users name in user profile", async () => {
        let name = "Ryan Reynolds";

        const updateUsersFullName = await request(app)
            .patch(`/api/user-profile/users/${userId}/name`)
            .set("Authorization", `Bearer ${token}`)
            .send({name})
            .expect(201);

        expect(updateUsersFullName.body.success).toBe(true);

        // Get users profile with bio.
        const fetchUserProfile = await request(app)
            .get(`/api/user-profile/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        expect(fetchUserProfile.body._id).toBeDefined();
        expect(fetchUserProfile.body.userId).toEqual(userId);
        expect(fetchUserProfile.body.name).toEqual(name);
        expect(fetchUserProfile.body.accountType).toEqual("1");
        expect(fetchUserProfile.body.bio).toEqual(userBio);
    });

    it("should add groups", async () => {
        const groupNameOne = "XMen";

        // Add Group 1.
        await request(app)
            .post("/api/groups/")
            .set("Authorization", `Bearer ${token}`)
            .send({name: groupNameOne, userId})
            .expect(201);

        // Fetch users groups.
        const userGroups = await request(app)
            .get(`/api/users/${userId}/groups`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);
        console.log("User Groups: ", userGroups.body);

        expect(userGroups.body._id).toBeDefined();
        expect(userGroups.body.name).toEqual(groupNameOne);
        expect(userGroups.body.owners.toInclude(userId)).toBe(true);
        expect(userGroups.body.users).toBeDefined();

        const groupId = userGroups.body._id;

        // Fetch XMen Group.
        const XMenGroup = await request(app)
            .get(`/api/groups/${groupId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        console.log("XMenGroup: ", XMenGroup.body);
    });

    // it("should search for users and groups", async () => {
    //     // Endpoint to search for users and groups.

    //     // Endpoint to return users profile and groups after user selects user from search.

    //     // Endpoint to return group after user selects group from search.
    // });

    // it("should delete users account", async () => {

    // });
});