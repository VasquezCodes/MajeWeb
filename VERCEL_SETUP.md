# Configuración de Variables de Entorno en Vercel

## 🚀 Pasos para Desplegar en Vercel

### 1. Ir a tu Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto
3. Click en **"Settings"**
4. Click en **"Environment Variables"** en el menú lateral

### 2. Agregar Variables de Entorno

Agrega **TODAS** estas variables:

#### Firebase Client (Frontend)
```
NEXT_PUBLIC_FIREBASE_API_KEY = tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = tu_app_id
```

#### Firebase Admin (Backend) - IMPORTANTE
```
FIREBASE_PROJECT_ID = tu_proyecto_id
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n
```

**⚠️ IMPORTANTE para FIREBASE_PRIVATE_KEY:**
- Copia el valor COMPLETO incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Los saltos de línea deben ser `\n` (no saltos reales)
- Ejemplo: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n`

#### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_... (o pk_test_... para pruebas)
STRIPE_SECRET_KEY = sk_live_... (o sk_test_... para pruebas)
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_CURRENCY = usd
```

#### Email (Resend)
```
RESEND_API_KEY = re_...
EMAIL_FROM = Maje Nail Spa <onboarding@resend.dev>
OWNER_EMAIL = tu_email@example.com
```

#### Base URL
```
NEXT_PUBLIC_BASE_URL = https://tu-dominio.vercel.app
```

### 3. Configurar para Todos los Entornos

Para cada variable, asegúrate de marcar:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

### 4. Re-desplegar

Después de agregar todas las variables:

1. Ve a **"Deployments"**
2. Click en los **"..."** del último deployment
3. Click en **"Redeploy"**
4. Espera a que termine el build

### 5. Verificar

Una vez desplegado:

1. Ve a tu sitio: `https://tu-dominio.vercel.app`
2. Prueba el login admin: `https://tu-dominio.vercel.app/admin/login`
3. Verifica que el webhook funcione haciendo una compra de prueba

## 🔍 Dónde Encontrar los Valores

### Firebase Client
1. Firebase Console → ⚙️ Project Settings → General
2. Scroll down hasta "Your apps"
3. Selecciona tu Web app
4. Copia los valores de `firebaseConfig`

### Firebase Admin
1. Firebase Console → ⚙️ Project Settings → Service Accounts
2. Click en **"Generate new private key"**
3. Se descarga un archivo JSON
4. Usa los valores de ese archivo:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Stripe
1. Stripe Dashboard → Developers → API keys
2. Copia las claves (usa test keys para pruebas)
3. Para el webhook secret:
   - Stripe Dashboard → Developers → Webhooks
   - Crea un webhook apuntando a: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - Copia el "Signing secret"

### Resend
1. Resend Dashboard → API Keys
2. Crea una nueva API key
3. Cópiala (solo se muestra una vez)

## ⚠️ Errores Comunes

### Error: "Service account object must contain a string 'project_id' property"
**Causa:** Falta `FIREBASE_PROJECT_ID` o está vacía.
**Solución:** Agrega la variable en Vercel y re-despliega.

### Error: "Firebase Admin no está configurado"
**Causa:** Faltan variables de Firebase Admin.
**Solución:** Verifica que `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` estén configuradas.

### Error: "Invalid private key"
**Causa:** El formato de `FIREBASE_PRIVATE_KEY` es incorrecto.
**Solución:** 
- Asegúrate de incluir `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Los saltos de línea deben ser `\n`
- No debe tener espacios extra

### Build exitoso pero funciones no funcionan
**Causa:** Variables solo configuradas para Production.
**Solución:** Marca todas las variables para Production, Preview y Development.

## 🎯 Checklist Final

Antes de desplegar, verifica:

- [ ] Todas las variables de Firebase Client están configuradas
- [ ] Todas las variables de Firebase Admin están configuradas
- [ ] `FIREBASE_PRIVATE_KEY` tiene el formato correcto
- [ ] Variables de Stripe están configuradas
- [ ] Variables de Resend están configuradas
- [ ] `NEXT_PUBLIC_BASE_URL` apunta a tu dominio de Vercel
- [ ] Todas las variables están marcadas para todos los entornos
- [ ] Re-desplegaste después de agregar las variables

## 🚀 Listo!

Una vez configurado todo:

✅ El sitio funcionará en producción
✅ El panel admin funcionará
✅ Los webhooks de Stripe funcionarán
✅ Los emails se enviarán correctamente
✅ Las reservas se guardarán en Firebase
