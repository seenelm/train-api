import { ProgramResponse } from "../../programs/dto/programDto";

export interface GroupProgramsRequest {
    groupId: string;
    programs: string[];
}

export interface GroupProgramsResponse {
    groupId: string;
    programs: string[];
}

export interface DetailedGroupProgramsResponse {
    groupId: string;
    programs: ProgramResponse[];
}
