import admin from "../../infrastructure/firebase";
import { NextFunction, Request, Response } from "express";

export const verifyFirebaseToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};
