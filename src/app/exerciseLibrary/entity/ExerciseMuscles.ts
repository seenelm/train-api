import { Types } from "mongoose";

export default class ExerciseMuscles {
    private id: Types.ObjectId;
    private exerciseId: Types.ObjectId;
    private muscleId: Types.ObjectId;
    private primary: boolean;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(builder: ExerciseMusclesBuilder) {
        this.id = builder.id;
        this.exerciseId = builder.exerciseId;
        this.muscleId = builder.muscleId;
        this.primary = builder.primary;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    static builder(): ExerciseMusclesBuilder {
        return new ExerciseMusclesBuilder();
    }

    public getId(): Types.ObjectId {
        return this.id;
    }

    public getExerciseId(): Types.ObjectId {
        return this.exerciseId;
    }

    public getMuscleId(): Types.ObjectId {
        return this.muscleId;
    }

    public isPrimary(): boolean {
        return this.primary;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}

class ExerciseMusclesBuilder {
    id: Types.ObjectId;
    exerciseId: Types.ObjectId;
    muscleId: Types.ObjectId;
    primary: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    public setId(id: Types.ObjectId): this {
        this.id = id;
        return this;
    }

    public setExerciseId(exerciseId: Types.ObjectId): this {
        this.exerciseId = exerciseId;
        return this;
    }

    public setMuscleId(muscleId: Types.ObjectId): this {
        this.muscleId = muscleId;
        return this;
    }

    public setPrimary(primary: boolean): this {
        this.primary = primary;
        return this;
    }

    public setCreatedAt(createdAt: Date): this {
        this.createdAt = createdAt;
        return this;
    }

    public setUpdatedAt(updatedAt: Date): this {
        this.updatedAt = updatedAt;
        return this;
    }

    public build(): ExerciseMuscles {
        return new ExerciseMuscles(this);
    }
}
