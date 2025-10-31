// scripts/verify-firebase-config.js
// Script para verificar que Firebase está configurado correctamente

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Verificando configuración de Firebase...\n');

// Verificar variables del cliente
const clientVars = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar variables del admin
const adminVars = {
  'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID,
  'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL,
  'FIREBASE_PRIVATE_KEY': process.env.FIREBASE_PRIVATE_KEY,
};

console.log('📱 Variables del Cliente (Frontend):');
let clientOk = true;
for (const [key, value] of Object.entries(clientVars)) {
  if (value) {
    console.log(`  ✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${key}: NO CONFIGURADA`);
    clientOk = false;
  }
}

console.log('\n🔐 Variables del Admin (Backend):');
let adminOk = true;
for (const [key, value] of Object.entries(adminVars)) {
  if (value) {
    const display = key === 'FIREBASE_PRIVATE_KEY' 
      ? value.substring(0, 30) + '...' 
      : value.substring(0, 40) + '...';
    console.log(`  ✅ ${key}: ${display}`);
  } else {
    console.log(`  ❌ ${key}: NO CONFIGURADA`);
    adminOk = false;
  }
}

console.log('\n📊 Resumen:');
if (clientOk && adminOk) {
  console.log('  ✅ Todas las variables están configuradas correctamente');
  console.log('\n✨ Próximos pasos:');
  console.log('  1. Habilita Authentication en Firebase Console');
  console.log('  2. Crea un usuario admin en Authentication → Users');
  console.log('  3. Reinicia el servidor: npm run dev');
  console.log('  4. Accede a /admin/login\n');
} else {
  console.log('  ❌ Faltan variables de configuración');
  console.log('\n📖 Solución:');
  console.log('  1. Copia .env.example a .env.local');
  console.log('  2. Completa todas las variables con tus datos de Firebase');
  console.log('  3. Reinicia el servidor\n');
  console.log('  Ver CONFIGURACION_ADMIN.md para más detalles\n');
}
