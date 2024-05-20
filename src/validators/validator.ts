import { plainToClass, ClassConstructor } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export const validateRequest = (
    dto: ClassConstructor<any>,
    sources: ("body" | "query" | "params")[] = ["body"],
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (const source of sources) {
            const requestInstance = plainToClass(dto, req[source]);

            try {
                await validateOrReject(requestInstance);
                req[source] = requestInstance;
            } catch (error) {
                console.log("Valiation Error 1: ", error);
                return res.status(HttpStatusCode.BAD_REQUEST).json(error);
            }
        }

        next();
    };
};

export class DTOValidatorService {
    public async validateRequest(dto: any) {
        try {
            await validateOrReject(dto);
        } catch (errors) {
            console.log("Error: ", errors);
            const errorMessages = {};
            if (Array.isArray(errors)) {
                errors.forEach((error: ValidationError) => {
                    errorMessages[error.property] =
                        errorMessages[error.property] || [];
                    Object.keys(error.constraints).forEach((key) => {
                        errorMessages[error.property].push(
                            error.constraints[key],
                        );
                    });
                });
            }
            return errorMessages;
        }
    }
}
