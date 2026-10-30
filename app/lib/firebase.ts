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

// Singleton pattern to avoid re-initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, serverTimestamp };

// Helper to save gas price
export const saveGasPrice = async (gasData: any) => {
    try {
        await setDoc(doc(db, "telemetry", "latest_gas"), {
            ...gasData,
            updatedAt: serverTimestamp()
        });
        console.log("Gas price cached to Firebase.");
    } catch (e) {
        console.error("Firebase Cache Error:", e);
    }
};

// Helper to get fallback gas price
export const getCachedGasPrice = async () => {
    try {
        const snap = await getDoc(doc(db, "telemetry", "latest_gas"));
        if (snap.exists()) {
            return snap.data();
        }
    } catch (e) {
        console.error("Firebase Read Error:", e);
    }
    return null;
};
