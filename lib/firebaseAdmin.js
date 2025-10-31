// /lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

// 🔧 1. Corrige los saltos de línea
if (privateKey?.includes("\\n")) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

// 🔧 2. Inicializar solo una vez
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin inicializado correctamente.");
  } catch (err) {
    console.error("❌ Error inicializando Firebase Admin:", err);
  }
}

const adminDb = getFirestore();

// 🔧 3. Export nombrado y por defecto (opcional)
export { adminDb };
export default adminDb;
