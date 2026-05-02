## Overview

Backend (NestJS) is now under `backend/` and a simple static frontend is under `frontend/`. Frontend is plain HTML/CSS/JS and talks to the API with `fetch` using JWT tokens.

## Structure

- `backend/` – NestJS app (src, prisma, configs, package.json)
- `frontend/` – static files (`index.html`, `styles.css`, `app.js`)

## Backend – run

```bash
cd backend
npm install        # first time
npm run start:dev  # dev watch on http://localhost:3000
```

- Set `JWT_SECRET` in env for real usage (defaults to `change-this-secret`).
- Uses SQLite at `backend/prisma/dev.db`.

## Frontend – run

- Open `frontend/index.html` directly in browser, or serve statically (e.g. `npx http-server frontend`).
- In the page, set API base (default `http://localhost:3000`), register/login to get a token, then call CRUD sections. Token is stored in `localStorage`.

## Auth & roles

- Endpoints expect `Authorization: Bearer <token>`.
- Admin-only routes: user management, admin routes, and anything protected with `@Roles('admin')`.

## Notes

- Logging interceptor prints `[METHOD] /path - Xms` in backend console.
- Many controllers still use mocked userId for cart/orders/comments; provide IDs in forms where required.
