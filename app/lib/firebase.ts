import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Safe singleton pattern with optional Firebase keys
let app: any = null;
let db: any = null;

if (typeof window !== "undefined" && firebaseConfig.apiKey) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
    } catch {
        // Suppress missing/invalid Firebase configuration in production
    }
}

export { db, doc, setDoc, getDoc, serverTimestamp };

// Helper to save gas price
export const saveGasPrice = async (gasData: any) => {
    if (!db) return;
    try {
        await setDoc(doc(db, "telemetry", "latest_gas"), {
            ...gasData,
            updatedAt: serverTimestamp()
        });
    } catch {
        // Silent fallback
    }
};

// Helper to get fallback gas price
export const getCachedGasPrice = async () => {
    if (!db) return null;
    try {
        const snap = await getDoc(doc(db, "telemetry", "latest_gas"));
        if (snap.exists()) {
            return snap.data();
        }
    } catch {
        // Silent fallback
    }
    return null;
};
