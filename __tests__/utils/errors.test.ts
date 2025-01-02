import { Error as MongooseError } from "mongoose";
import { handleMongoDBError, DatabaseError } from "../../src/utils/errors";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { MongoServerErrorType } from "../../src/common/enums";
import { MongoServerError } from "mongodb";

describe("Custom Database and API error classes", () => {
    describe("handleMongoDBError", () => {
        it("should handle ValidationError", () => {
            // Arrange
            const error = new MongooseError.ValidationError();
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual(error.message);
            expect(result.code).toEqual(MongoServerErrorType.ValidationError);
            expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
        });

        it("should handle CastError", () => {
            // Arrange
            const error = new MongooseError.CastError(
                "ObjectId",
                "invalid-id",
                "userId",
            );
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual(error.message);
            expect(result.code).toEqual(MongoServerErrorType.CastError);
            expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
        });

        it("should handle DocumentNotFoundError", () => {
            // Arrange
            const error = new MongooseError.DocumentNotFoundError(
                "Document not found",
            );
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual(error.message);
            expect(result.code).toEqual(
                MongoServerErrorType.DocumentNotFoundError,
            );
            expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
        });

        it("should handle DuplicateKeyError", () => {
            // Arrange
            const error = new MongoServerError({
                code: 11000,
                message: "Duplicate key error",
            });
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual(error.message);
            expect(result.code).toEqual(MongoServerErrorType.DuplicateKeyError);
            expect(result.statusCode).toEqual(HttpStatusCode.CONFLICT);
        });

        it("should handle MongoServerError", () => {
            // Arrange
            const error = new MongoServerError({
                code: 12345,
                message: "Mongo server error",
            });
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual(error.message);
            expect(result.code).toEqual(MongoServerErrorType.MongoServerError);
            expect(result.statusCode).toEqual(
                HttpStatusCode.SERVICE_UNAVAILABLE,
            );
        });

        it("should handle unknown error", () => {
            // Arrange
            const error = new Error("Unknown error");
            // Act
            const result = handleMongoDBError(error);
            // Assert
            expect(result).toBeInstanceOf(DatabaseError);
            expect(result.message).toEqual("Unknown database error occurred");
            expect(result.code).toEqual("UNEXPECTED_ERROR");
            expect(result.statusCode).toEqual(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
            );
        });
    });
});
