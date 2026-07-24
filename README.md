# GitHub Profile Viewer

Prueba técnica full stack desarrollada con **NestJS** y **Next.js**.

La aplicación consulta la información pública de un usuario de GitHub mediante
un backend propio y presenta los datos en una interfaz responsive.

## Demo

- Frontend: https://github-profile-viewer-xi-sand.vercel.app
- Backend: https://github-profile-viewer-xi-sand.vercel.app
- Endpoint:
  `https://github-profile-viewer-xi-sand.vercel.app/user/Andrewshumeiker`

## Tecnologías

### Backend

- NestJS
- TypeScript
- `HttpModule`

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules

## Flujo

```text
Next.js → GET /user/:username → NestJS → GitHub REST API
```

El frontend consume exclusivamente el endpoint desarrollado en NestJS. El
backend transforma la respuesta de GitHub y devuelve solo los campos utilizados
por la interfaz.

Ejemplo:

```json
{
  "username": "Andrewshumeiker",
  "name": "Andrés David Covaleda Vargas",
  "avatarUrl": "https://avatars.githubusercontent.com/...",
  "bio": "Software developer",
  "location": "Colombia",
  "company": null,
  "blog": null,
  "profileUrl": "https://github.com/Andrewshumeiker",
  "publicRepos": 20,
  "followers": 15,
  "following": 10
}
```

## Ejecución local

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run start:dev
```

El backend estará disponible en `http://localhost:3001`.

### Frontend

En otra terminal:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

El frontend estará disponible en `http://localhost:3000`.

En macOS o Linux, reemplaza `copy` por `cp`.

## Variables de entorno

Backend:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
GITHUB_TOKEN=
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_USERNAME=Andrewshumeiker
```

`GITHUB_TOKEN` es opcional y no debe publicarse.

## Manejo de errores

- `400` para usernames inválidos.
- `404` cuando el usuario no existe.
- `502` cuando GitHub no puede responder.

La interfaz transforma estos escenarios en mensajes comprensibles para el
usuario.
