import {
    IsMongoId,
    IsNotEmpty,
    IsEmpty,
    IsString,
    IsNumber,
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    Max,
    Length,
} from "class-validator";

import { Types } from "mongoose";

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsObjectId",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Types.ObjectId.isValid(value);
                },
            },
        });
    };
}

export class FetchUserGroupsRequest {
    @IsObjectId({ message: "Invalid userId" })
    userId: Types.ObjectId;
}

export class FetchUserDataRequest {
    @IsObjectId({ message: "Invalid userId" })
    userId: Types.ObjectId;
}

export class UpdateUserProfileRequest {
    @IsObjectId({ message: "Invalid userId" })
    userId: Types.ObjectId;

    @IsString()
    @Length(1, 35)
    name: string;

    @IsString()
    userBio: string;

    @IsNumber()
    accountType: number;
}
