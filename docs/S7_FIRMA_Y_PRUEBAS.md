# Semana 7 - Pruebas, firma y App Bundle

## Pruebas unitarias

Archivos agregados:

- `src/app/services/app-data.service.spec.ts`
- `src/app/services/dbtask.service.spec.ts`

Comando:

```powershell
.\node_modules\.bin\ng.cmd test
```

## Pruebas End-To-End con Protractor

Archivos agregados:

- `e2e/protractor.conf.js`
- `e2e/tsconfig.e2e.json`
- `e2e/src/app.po.ts`
- `e2e/src/app.e2e-spec.ts`

Pasos:

```powershell
npm install --legacy-peer-deps
npm run start
```

En otra terminal:

```powershell
npm run e2e
```

## Configuracion por plataforma

Archivo agregado:

- `src/app/config/app-platform.config.ts`

Este archivo define configuracion para `ios`, `android` y `mobileweb`, incluyendo nombre de app, identificador, API base, permisos requeridos y destino de distribucion.

## Generar APK y sincronizar Android

Despues de cambiar codigo:

```powershell
.\node_modules\.bin\ng.cmd build
node .\node_modules\@capacitor\cli\bin\capacitor sync android
```

APK debug:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## Generar llave de firma

No se debe subir la llave real a GitHub. El archivo `.gitignore` ya ignora llaves `.jks`, `.keystore` y `release-signing.properties`.

Comando de ejemplo:

```powershell
keytool -genkeypair -v -keystore android\signing\skeletonapp-release-key.jks -alias skeletonapp -keyalg RSA -keysize 2048 -validity 10000
```

Tambien queda un ejemplo en:

```text
android\signing\release-signing.properties.example
```

Para usar firma por Gradle, copiar ese ejemplo como:

```text
android\signing\release-signing.properties
```

Luego completar las claves reales. El archivo `android/app/build.gradle` ya lee esa configuracion cuando existe.

## Generar App Bundle AAB

En Android Studio:

```text
Build > Generate Signed Bundle / APK > Android App Bundle
```

Salida esperada:

```text
android\app\build\outputs\bundle\release\app-release.aab
```

## Generar APK firmado

En Android Studio:

```text
Build > Generate Signed Bundle / APK > APK
```

Salida esperada:

```text
android\app\build\outputs\apk\release\app-release.apk
```
