import admin from "firebase-admin";
const serviceAccount = require("../../config/firebase-config.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
export default messaging;
