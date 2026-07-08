# Semana 8 - Evidencia con Cypress y publicacion simulada

El docente pidio reforzar pruebas automatizadas con Cypress y simular la publicacion de la app.

## Archivos agregados

- `cypress.config.js`
- `cypress/e2e/skeletonapp.cy.js`
- `cypress/support/e2e.js`

## Que prueban los E2E

- Home queda protegido si no hay sesion activa.
- Login/registro pasa el usuario hacia Home.
- Navegacion desde Home hacia API Connection.
- Ruta invalida muestra Error 404.

## Comandos

Instalar Cypress compatible con Node 16.18.1:

```powershell
npm install --legacy-peer-deps
```

Abrir Cypress:

```powershell
npm run cy:open
```

Ejecutar pruebas en consola:

```powershell
npm run cy:run
```

Antes de ejecutar Cypress, levantar la app:

```powershell
npm run start
```

## Evidencia para el video

Mostrar:

1. Carpeta `cypress/e2e`.
2. Archivo `skeletonapp.cy.js`.
3. Cypress abierto o ejecucion `npm run cy:run`.
4. App mostrando Login, Home, API Connection y Error 404.
5. Android Studio generando APK y AAB.
6. Ficha de Play Store simulada en la presentacion S8.
