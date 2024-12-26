export enum ProfileAccess {
    Public = 1,
    Private = 2,
}

export enum EventStatus {
    Pending = 1,
    Accepted = 2,
    Rejected = 3,
}

export enum MongoServerErrorType {
    ValidationError = "VALIDATION_ERROR",
    CastError = "CAST_ERROR",
    DocumentNotFoundError = "DOCUMENT_NOT_FOUND",
    DuplicateKeyError = "DUPLICATE_KEY",
    MongoServerError = "MONGO_SERVER_ERROR",
}
