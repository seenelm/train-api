declare global {
    namespace Express {
        interface Request {
            user: any;
            firebaseUser: any;
        }
    }
}

export {};
