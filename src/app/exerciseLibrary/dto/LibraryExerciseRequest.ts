export default class LibraryExerciseRequest {
    private name: string;
    private imagePath?: string;
    private description?: string;
    private categoryId?: string;
    private difficulty?: string;
    private equipment?: string[];

    constructor(builder: LibraryExerciseRequestBuilder) {
        this.name = builder.name;
        this.imagePath = builder.imagePath;
        this.description = builder.description;
        this.categoryId = builder.categoryId;
        this.difficulty = builder.difficulty;
        this.equipment = builder.equipment;
    }

    static builder(): LibraryExerciseRequestBuilder {
        return new LibraryExerciseRequestBuilder();
    }

    public getName(): string {
        return this.name;
    }

    public getImagePath(): string | undefined {
        return this.imagePath;
    }

    public getDescription(): string | undefined {
        return this.description;
    }

    public getCategoryId(): string | undefined {
        return this.categoryId;
    }

    public getDifficulty(): string | undefined {
        return this.difficulty;
    }

    public getEquipment(): string[] | undefined {
        return this.equipment;
    }
}

class LibraryExerciseRequestBuilder {
    name: string;
    imagePath?: string;
    description?: string;
    categoryId?: string;
    difficulty?: string;
    equipment?: string[];

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public setImagePath(imagePath: string): this {
        this.imagePath = imagePath;
        return this;
    }

    public setDescription(description: string): this {
        this.description = description;
        return this;
    }

    public setCategoryId(categoryId: string): this {
        this.categoryId = categoryId;
        return this;
    }

    public setDifficulty(difficulty: string): this {
        this.difficulty = difficulty;
        return this;
    }

    public setEquipment(equipment: string[]): this {
        this.equipment = equipment;
        return this;
    }

    public build(): LibraryExerciseRequest {
        return new LibraryExerciseRequest(this);
    }
}
