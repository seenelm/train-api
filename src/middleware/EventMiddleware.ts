import { Request, Response, NextFunction } from "express";

class EventMiddleware {
    validateAddEvent = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const errors: string[] = [];
        const {
            name,
            admin,
            invitees,
            startTime,
            endTime,
            location,
            description,
        } = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            errors.push("Name is required and must be a non-empty string.");
        }

        if (!admin || !Array.isArray(admin) || admin.length === 0) {
            errors.push(
                "Admin is required and must be a non-empty array of ObjectIds.",
            );
        }

        if (!startTime) {
            errors.push("Start time is required.");
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    };
}

export default new EventMiddleware();
