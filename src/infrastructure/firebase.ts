import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
console.log("✅ Firebase initialized from env");

export default admin;
