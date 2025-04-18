import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const firebaseConfigPath = process.env.FIREBASE_CONFIG;

if (!firebaseConfigPath) {
  console.warn("⚠️ FIREBASE_CONFIG env var is missing.");
} else {
  try {
    // Read the file from the path specified in the environment variable
    const serviceAccountContent = fs.readFileSync(path.resolve(process.cwd(), firebaseConfigPath), 'utf8');
    const serviceAccount = JSON.parse(serviceAccountContent);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase initialized from config file");
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error);
  }
}

export default admin;
