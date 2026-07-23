import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

let db: any = null;
let useFirestore = false;
let app: any = null;

try {
  if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    useFirestore = true;
  }
} catch (err) {
  console.error("[Firestore] Failed to initialize client-side Firestore SDK:", err);
  useFirestore = false;
}

export { db, useFirestore, app };
