import request from "supertest";
import { app, db } from "../../src/app";
import { server } from "../../src/server";
import { Types } from "mongoose";
import logger from "../../src/common/logger";
import { Server } from "http";

// jest.setTimeout(10000);
describe("User Controller Integration Tests", () => {
    let server: Server;

    // User One
    let userId: Types.ObjectId;
    let userBio: String;
    let userOneName: String;
    let token: String;

    // User Two
    let userTwoId: Types.ObjectId;
    let tokenTwo: String

    let groupOneId: Types.ObjectId;
    let groupOneBio: String;
    let groupOneName: String;

    const userData = {
        username: "deadpool",
        password: "Password98!",
        name: "Deadpool"
    }

    beforeEach(() => {
        server = app.listen(3001);
    });

    afterEach(async () => {
        // server.close();
        await new Promise<void>((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    logger.error("Error closing server: ", err);
                    reject(err);
                } else {
                   setTimeout(() => {
                    resolve()
                   }, 500);
                }
            });
        });
    });

    it("should register a user", async () => {
        // Register user.
        const response = await request(app).post("/api/register").send(userData).expect(201);

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
            username: userData.username,
            isActive: true
        });      
    });

    it("should register user two", async () => {
        const userTwoData = {
            username: "testUser2",
            password: "Password2!",
            name: "User Two"
        }

        // Register user.
        const response = await request(app).post("/api/register").send(userTwoData).expect(201);

        expect(response.body.userId).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.username).toBe(userTwoData.username);

        userTwoId = response.body.userId;
        tokenTwo = response.body.token;

        // Check User Two was added by fetching the user.
        const userResponse = await request(app)
            .get(`/api/${userTwoId}`)
            .set("Authorization", `Bearer ${tokenTwo}`)
            .expect(201); 
             
       expect(userResponse.body._id).toBeDefined();
       expect(userResponse.body.username).toEqual(userTwoData.username);
       expect(userResponse.body.isActive).toBe(true); 
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
        userOneName = "Ryan Reynolds";

        const updateUsersFullName = await request(app)
            .patch(`/api/user-profile/users/${userId}/name`)
            .set("Authorization", `Bearer ${token}`)
            .send({name: userOneName})
            .expect(201);

        expect(updateUsersFullName.body.success).toBe(true);

        // Get users profile with bio.
        const fetchUserProfile = await request(app)
            .get(`/api/user-profile/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        expect(fetchUserProfile.body._id).toBeDefined();
        expect(fetchUserProfile.body.userId).toEqual(userId);
        expect(fetchUserProfile.body.name).toEqual(userOneName);
        expect(fetchUserProfile.body.accountType).toEqual("1");
        expect(fetchUserProfile.body.bio).toEqual(userBio);
    });

    it("should add groups", async () => {
        groupOneName = "Group One";

        // Add Group 1.
        const groupOne = await request(app)
            .post("/api/groups/")
            .set("Authorization", `Bearer ${token}`)
            .send({name: groupOneName, userId})
            .expect(201);

        expect(groupOne.body.id).toBeDefined();
        expect(groupOne.body.name).toEqual(groupOneName);

        // Fetch users groups.
        const userGroups = await request(app)
            .get(`/api/users/${userId}/groups`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);


        expect(userGroups.body[0]._id).toBeDefined();
        expect(userGroups.body[0].name).toEqual(groupOneName);
        // expect(userGroups.body[0].owners.includes(userId)).toBe(true);
        expect(userGroups.body[0].users).toBeDefined();
        expect(userGroups.body[0].requests).toBeDefined();

        groupOneId = userGroups.body[0]._id;

        // Fetch Group One.
        const fetchGroupOne = await request(app)
            .get(`/api/groups/${groupOneId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(fetchGroupOne.body._id).toEqual(groupOneId);
        expect(fetchGroupOne.body.name).toEqual(groupOneName);
        expect(fetchGroupOne.body.owners.includes(userId)).toBe(true);
        expect(fetchGroupOne.body.users).toBeDefined();
        expect(fetchGroupOne.body.requests).toBeDefined();
    });

    it("should allow admin to update group bio", async () => {
        groupOneBio = "FitSpace for Group One";

        // Add Group One Bio.
        await request(app)
            .put(`/api/groups/${groupOneId}/users/${userId}/profile/bio`)
            .send({groupBio: groupOneBio})
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        // Fetch Updated Group One with new bio.
        const fetchGroup = await request(app)
            .get(`/api/groups/${groupOneId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(fetchGroup.body._id).toEqual(groupOneId);
        expect(fetchGroup.body.name).toEqual(groupOneName);
        expect(fetchGroup.body.owners.includes(userId)).toBe(true);
        expect(fetchGroup.body.users).toBeDefined();
        expect(fetchGroup.body.requests).toBeDefined();
        expect(fetchGroup.body.bio).toEqual(groupOneBio);
    });

    it("should allow admin to update Group name", async () => {
        groupOneName = "Group One!";

        // Update Group One Name.
        await request(app)
            .patch(`/api/groups/${groupOneId}/users/${userId}/profile/name`)
            .send({groupName: groupOneName })
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        // Fetch Updated Group One with new name.
        const fetchGroup = await request(app)
            .get(`/api/groups/${groupOneId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(fetchGroup.body._id).toEqual(groupOneId);
        expect(fetchGroup.body.name).toEqual(groupOneName);
        expect(fetchGroup.body.owners.includes(userId)).toBe(true);
        expect(fetchGroup.body.users).toBeDefined();
        expect(fetchGroup.body.requests).toBeDefined();
        expect(fetchGroup.body.bio).toEqual(groupOneBio);
    });

    it("should search for user", async () => {
        const user = "deadpool";
        
        // Search for user.
        const users = await request(app)
            .get(`/api/search/query?query=${user}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(users.body[0]._id).toEqual(userId);
        expect(users.body[0].username).toEqual(userData.username);
        expect(users.body[0].name).toEqual(userOneName);

        // Endpoint to return users profile and groups after user selects user from search.
        const usersData = await request(app)
            .get(`/api/${userId}/profile-data`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        // Return username and id from users collection.
        expect(usersData.body[0]._id).toEqual(userId);
        expect(usersData.body[0].username).toEqual(userData.username);

        // Return data from userprofiles collection.
        expect(usersData.body[0].userProfile[0]._id).toBeDefined();
        expect(usersData.body[0].userProfile[0].userId).toEqual(userId);
        expect(usersData.body[0].userProfile[0].name).toEqual(userOneName);
        expect(usersData.body[0].userProfile[0].accountType).toEqual("1");
        expect(usersData.body[0].userProfile[0].bio).toEqual(userBio);

        // Return data from usergroups collection.
        expect(usersData.body[0].userGroups[0]._id).toBeDefined();
        expect(usersData.body[0].userGroups[0].userId).toEqual(userId);
        expect(usersData.body[0].userGroups[0].groups[0]).toEqual(groupOneId);
    });

    it("should search for group", async () => {
        const group = "Group One!";
        
        // Search for user.
        const groups = await request(app)
            .get(`/api/search/query?query=${group}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        const groupId = groups.body[0]._id;

        expect(groups.body[0]._id).toBeDefined();
        expect(groups.body[0].name).toEqual(group);
        
        // Endpoint to return group after user selects group from search.
        const fetchGroup = await request(app)
            .get(`/api/groups/${groupId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(fetchGroup.body._id).toEqual(groupId);
        expect(fetchGroup.body.name).toEqual(groupOneName);
        expect(fetchGroup.body.owners.includes(userId)).toBe(true);
        expect(fetchGroup.body.users).toBeDefined();
        expect(fetchGroup.body.requests).toBeDefined();
        expect(fetchGroup.body.bio).toEqual(groupOneBio);
    });

    it("user one should follow user two", async () => {
        const followeeId = userTwoId;
        const followUser = await request(app)
            .post("/api/user-profile/users/")
            .send({followeeId})
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        expect(followUser.body.success).toBe(true);

        // Get User One Followers.
        const followers = await request(app)
            .get(`/api/user-profile/users/${userId}/followers`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)

        console.log("Followers: ", followers.body);
        expect(followers.body).toHaveLength(0);

        // Get User One following.
        const following = await request(app)
            .get(`/api/user-profile/users/${userId}/following`)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        console.log("Following: ", following.body);
        
    });

    // it("should delete users account", async () => {
    //     const deleteUser = await request(app)
    //         .delete(`/api/${userId}`)
    //         .set("Authorization", `Bearer ${token}`)
    //         .expect(201)

    //     expect(deleteUser.body.success).toBe(true);
    // });
});