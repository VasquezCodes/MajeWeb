// /lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Validar que las variables existan
if (!projectId || !clientEmail || !privateKey) {
  console.warn("⚠️ Firebase Admin: Variables de entorno no configuradas. Algunas funcionalidades no estarán disponibles.");
}

// 🔧 1. Corrige los saltos de línea
if (privateKey?.includes("\\n")) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

// 🔧 2. Inicializar solo una vez (solo si tenemos las credenciales)
if (!getApps().length && projectId && clientEmail && privateKey) {
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

// Solo obtener Firestore si Firebase está inicializado
let adminDb = null;
try {
  if (getApps().length > 0) {
    adminDb = getFirestore();
  }
} catch (err) {
  console.warn("⚠️ No se pudo obtener Firestore:", err.message);
}

// 🔧 3. Export nombrado y por defecto (opcional)
export { adminDb };
export default adminDb;
