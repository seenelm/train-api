import admin from "firebase-admin";

let firebaseConfig: admin.ServiceAccount | undefined;

// Try to parse the FIREBASE_CONFIG environment variable if it exists
if (process.env.FIREBASE_CONFIG) {
  try {
    firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG) as admin.ServiceAccount;
  } catch (error) {
    console.error("Error parsing FIREBASE_CONFIG:", error);
  }
} 
// Initialize Firebase Admin if configuration is available
if (firebaseConfig) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
  console.log("Firebase initialized successfully");
} else {
  console.warn("Firebase credentials not found. Firebase functionality will not work.");
}

export default admin;
