import admin from "firebase-admin";

const firebaseEnvJson = process.env.FIREBASE_CONFIG;

if (!firebaseEnvJson) {
  console.warn("⚠️ FIREBASE_CONFIG env var is missing.");
} else {
  const serviceAccount = JSON.parse(firebaseEnvJson);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log("✅ Firebase initialized from env");
  }
}

export default admin;
