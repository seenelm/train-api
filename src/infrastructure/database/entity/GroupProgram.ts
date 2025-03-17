import { Types } from "mongoose";

export default class GroupProgram {
    private id: Types.ObjectId;
    private groupId: Types.ObjectId;
    private programs: Types.ObjectId[];

    constructor(builder: GroupProgramBuilder) {
        this.id = builder.id;
        this.groupId = builder.groupId;
        this.programs = builder.programs;
    }

    static builder(): GroupProgramBuilder {
        return new GroupProgramBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }

    public getGroupId(): Types.ObjectId {
        return this.groupId;
    }

    public getPrograms(): Types.ObjectId[] {
        return this.programs;
    }
}

class GroupProgramBuilder {
    id: Types.ObjectId;
    groupId: Types.ObjectId;
    programs: Types.ObjectId[] = [];

    setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }

    setGroupId(groupId: Types.ObjectId): this {
        this.groupId = groupId;
        return this;
    }

    setPrograms(programs: Types.ObjectId[]): this {
        this.programs = programs;
        return this;
    }

    build(): GroupProgram {
        return new GroupProgram(this);
    }
}