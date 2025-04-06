import express from "express";
const groupRouter = express.Router();
import GroupController from "../controller/groupController";
import { authenticate } from "../middleware/authenticate";
import GroupService from "../service/GroupService";
import GroupDAO from "../dao/GroupDAO";
import { GroupModel } from "../model/groupModel";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import { UserGroupsModel } from "../model/userGroups";
import ProgramService from "../app/programs/services/ProgramService";
import ProgramRepository from "../infrastructure/database/repositories/ProgramRepository";
import GroupMiddleware from "../common/middleware/GroupMiddleware";
import WeekRepository from "../infrastructure/database/repositories/WeekRepository";
import WorkoutRepository from "../infrastructure/database/repositories/WorkoutRepository";
import ExerciseRepository from "../infrastructure/database/repositories/ExerciseRepository";
import SetRepository from "../infrastructure/database/repositories/SetRepository";
import GroupProgramRepository from "../infrastructure/database/repositories/GroupProgramRepository";
import { GroupProgramsModel } from "../infrastructure/database/models/groupProgramModel";

const groupDAO = new GroupDAO(GroupModel);
const userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
const programRepository = new ProgramRepository();
const weekRepository = new WeekRepository();
const workoutRepository = new WorkoutRepository();
const exerciseRepository = new ExerciseRepository();
const setRepository = new SetRepository();
const groupProgramRepository = new GroupProgramRepository(GroupProgramsModel);

const groupService = new GroupService(
    groupDAO,
    userGroupsDAO,
    groupProgramRepository,
);
const programService = new ProgramService(
    programRepository,
    weekRepository,
    workoutRepository,
    exerciseRepository,
    setRepository,
    groupProgramRepository,
);

const groupController = new GroupController(groupService, programService);
const groupMiddleware = new GroupMiddleware(groupDAO);

groupRouter.get("/:groupId", authenticate, groupController.fetchGroup);

groupRouter.post("/", authenticate, groupController.addGroup);

groupRouter.post(
    "/:groupId/request",
    authenticate,
    groupController.requestToJoinGroup,
);

groupRouter.get(
    "/:groupId/request/profiles",
    authenticate,
    groupController.getJoinRequests,
);

groupRouter.get(
    "/:userId/requests",
    authenticate,
    groupController.getJoinRequestsByUser,
);

groupRouter.put(
    "/:groupId/profile",
    authenticate,
    groupController.updateGroupProfile,
);

groupRouter.put("/:groupId/join", authenticate, groupController.joinGroup);

// groupRouter.delete("/:groupId/delete", authenticate, groupController.deleteGroup);

groupRouter.post(
    "/:groupId/programs",
    authenticate,
    groupMiddleware.validateCreateProgram,
    groupController.createProgram,
);
groupRouter.put(
    "/:groupId/programs/:programId",
    authenticate,
    groupMiddleware.validateUpdateProgram,
    groupController.updateProgram,
);
groupRouter.delete(
    "/:groupId/programs/:programId",
    authenticate,
    groupMiddleware.validateDeleteProgram,
    groupController.deleteProgram,
);

groupRouter.post(
    "/:groupId/programs/weeks",
    authenticate,
    groupMiddleware.validateAddWeekToProgram,
    groupController.addWeekToProgram,
);
groupRouter.post(
    "/:groupId/programs/weeks/:weekId",
    authenticate,
    groupMiddleware.validateUpdateWeekInProgram,
    groupController.updateWeekInProgram,
);
groupRouter.delete(
    "/:groupId/programs/weeks/:weekId",
    authenticate,
    groupMiddleware.validateDeleteWeekInProgram,
    groupController.deleteWeekInProgram,
);

groupRouter.post(
    "/:groupId/programs/weeks/:weekId/workouts",
    authenticate,
    groupMiddleware.validateAddWorkout,
    groupController.addWorkout,
);
groupRouter.put(
    "/:groupId/programs/weeks/workouts/:workoutId",
    authenticate,
    groupMiddleware.validateUpdateWorkout,
    groupController.updateWorkout,
);
groupRouter.delete(
    "/:groupId/programs/weeks/workouts/:workoutId",
    authenticate,
    groupMiddleware.validateDeleteWorkout,
    groupController.deleteWorkout,
);

groupRouter.post(
    "/:groupId/programs/weeks/workouts/:workoutId/exercises",
    authenticate,
    groupController.addExerciseToWorkout,
);
groupRouter.put(
    "/:groupId/programs/weeks/workouts/exercises/:exerciseId",
    authenticate,
    groupController.updateExerciseInWorkout,
);
groupRouter.delete(
    "/:groupId/programs/weeks/workouts/exercises/:exerciseId",
    authenticate,
    groupController.deleteExerciseInWorkout,
);

groupRouter.post(
    "/:groupId/programs/weeks/workouts/exercises/:exerciseId/sets",
    authenticate,
    groupController.addSetToExercise,
);
groupRouter.put(
    "/:groupId/programs/weeks/workouts/exercises/sets/:setId",
    authenticate,
    groupController.updateSetInExercise,
);
groupRouter.delete(
    "/:groupId/programs/weeks/workouts/exercises/sets/:setId",
    authenticate,
    groupController.deleteSetInExercise,
);

// Get all programs for a group (basic info)
groupRouter.get(
    "/:groupId/programs",
    // authenticate,
    groupController.getGroupPrograms,
);

export default groupRouter;
