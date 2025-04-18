import admin from "firebase-admin";
import fs from "fs";
import path from "path";

/**
 * Check if a string is base64 encoded
 */
const isBase64 = (str: string): boolean => {
  const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  try {
    return base64Regex.test(str);
  } catch (e) {
    return false;
  }
};

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    const firebaseConfig = process.env.FIREBASE_CONFIG;
    
    if (!firebaseConfig) {
      console.warn("⚠️ FIREBASE_CONFIG env var is missing.");
      return;
    }
    
    let serviceAccount;
    
    // Try to parse as JSON first
    try {
      serviceAccount = JSON.parse(firebaseConfig);
      console.log("✅ Firebase config parsed from JSON string");
    } catch (jsonError) {
      // If not valid JSON, check if it's base64 encoded
      if (isBase64(firebaseConfig)) {
        try {
          const decoded = Buffer.from(firebaseConfig, 'base64').toString('utf-8');
          serviceAccount = JSON.parse(decoded);
          console.log("✅ Firebase config parsed from base64 string");
        } catch (base64Error) {
          console.error("❌ Error decoding base64 Firebase config:", base64Error);
          return;
        }
      } else {
        // Try to read as a file path as fallback
        try {
          const serviceAccountContent = fs.readFileSync(path.resolve(process.cwd(), firebaseConfig), 'utf8');
          serviceAccount = JSON.parse(serviceAccountContent);
          console.log("✅ Firebase config loaded from file path");
        } catch (fileError) {
          console.error("❌ Error reading Firebase config from file:", fileError);
          console.error("Original JSON parse error:", jsonError);
          return;
        }
      }
    }
    
    // Initialize Firebase if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase successfully initialized");
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error);
    console.error("Firebase config type:", typeof process.env.FIREBASE_CONFIG);
    console.error("Firebase config length:", process.env.FIREBASE_CONFIG?.length || 0);
  }
};

// Initialize Firebase
initializeFirebase();

export default admin;
