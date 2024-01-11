import Joi from "joi";
import { NextFunction, Request, Response } from "express";

const registerUserSchema = Joi.object({
    name: Joi.string().max(35).required().messages({
        "string.base": "Name must be a string",
        "string.max": "Name should not exceed 35 characters",
        "string.empty": "Name is required",
    }),
    username: Joi.string().min(6).max(10).required().messages({
        "string.base": "Username must be a string",
        "string.min": "Username should be at least 6 characters",
        "string.max": "Username should not exceed 10 characters",
        "string.empty": "Username is required",
    }),
    password: Joi.string()
        .pattern(
            new RegExp(
                "^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$",
            ),
        )
        .required()
        .messages({
            "string.base": "This field must be a string",
            "string.empty": "Password is required",
            "string.pattern.base":
                "Password must be a mix of upper & lower case letters, numbers & symbols",
        }),
});

const userLoginSchema = Joi.object({
    username: Joi.string().min(6).max(10).required().messages({
        "string.base": "Username must be a string",
        "string.min": "Username should be at least 6 characters",
        "string.max": "Username should not exceed 10 characters",
        "string.empty": "Username is required",
    }),
    password: Joi.string()
        .pattern(
            new RegExp(
                "^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$",
            ),
        )
        .required()
        .messages({
            "string.base": "This field must be a string",
            "string.empty": "Password is required",
            "string.pattern.base":
                "Password must be a mix of upper & lower case letters, numbers & symbols",
        }),
});

export const validateRegistration = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = registerUserSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errors = {};
        error.details.forEach((err) => {
            errors[err.context.key] = err.message;
        });

        return res.status(400).json({ errors });
    } else {
        next();
    }
};

export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = userLoginSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errors = {};
        error.details.forEach((err) => {
            errors[err.context.key] = err.message;
        });

        return res.status(400).json(errors);
    } else {
        next();
    }
};
