# Tashop

Full‑stack “mini marketplace” application: product listings, image uploads, purchases (Stripe Checkout), and real‑time (WebSocket) product updates.

> This repository contains two apps:
> - **Backend**: `tashop-backend/` (NestJS + Prisma + Postgres + Stripe + Socket.io)
> - **Frontend**: `tashop-ui/` (Next.js App Router + Server Actions + MUI + Socket.io-client)

---

## Features

- **Auth (Cookie + JWT)**: after login, backend sets an `Authentication` cookie.
- **Route protection**: Next.js `proxy.ts` redirects unauthenticated users away from protected routes.
- **Products**
  - Create product
  - Product list + product detail page
  - Product image upload (`/products/:id/image`)
  - **Static serving**: images are served from backend `public/`
- **Stripe Checkout**
  - Create checkout session
  - Webhook marks products as “sold”
- **Realtime**
  - Backend emits `productUpdated`
  - Frontend listens and revalidates the products list

---

## Tech Stack / Libraries

### Backend (`tashop-backend`)

- **NestJS** (`@nestjs/*`)
- **Prisma** (`prisma`, `@prisma/client`)
- **PostgreSQL**
- **Auth**
  - `passport`, `passport-local`, `passport-jwt`
  - `@nestjs/passport`, `@nestjs/jwt`
  - `bcrypt`
  - `cookie-parser`
- **Realtime**
  - `socket.io`, `@nestjs/websockets`, `@nestjs/platform-socket.io`
- **Logging**
  - `nestjs-pino`, `pino-pretty`
- **Payments**
  - `stripe`
- Utilities: `class-validator`, `class-transformer`, `ms`

### Frontend (`tashop-ui`)

- **Next.js 16 (App Router)** + **React 19**
- **Server Actions** (`'use server'`) to call the backend and read cookies
- **MUI v7** + Emotion (`@mui/material`, `@emotion/*`)
- **Socket.io client** (`socket.io-client`)
- **Stripe.js** (`@stripe/stripe-js`)

---

---

## Database Schema (Prisma)

Source: `tashop-backend/prisma/schema.prisma`

```mermaid
erDiagram
  User ||--o{ Product : "has"

  User {
    Int id PK
    String email UK
    String password
  }

  Product {
    Int id PK
    String name
    String description
    Float price
    Int userId FK
    Boolean sold
  }
```

---

## Architecture Diagrams

### 1) High-level component diagram

```mermaid
flowchart LR
  U[Browser] --> UI[Next.js UI (tashop-ui)]
  UI -->|HTTP (fetch)| API[NestJS API (tashop-backend)]
  UI <-->|WebSocket (socket.io)| API
  API --> DB[(PostgreSQL)]
  API -->|Serve static| IMG[/public/images/products/*.png/]
  API --> STRIPE[Stripe]
```

### 2) Login flow (Local Guard -> JWT cookie)

```mermaid
sequenceDiagram
  participant B as Browser
  participant UI as Next.js (Server Action)
  participant API as NestJS
  participant U as UsersService/DB

  B->>UI: Submit login form
  UI->>API: POST /auth/login (email+password)
  API->>U: getUser(email)
  U-->>API: user + passwordHash
  API->>API: bcrypt.compare(password, hash)
  API-->>UI: Set-Cookie Authentication=<jwt>
  UI-->>B: redirect("/")
```

### 3) Create product + realtime update

```mermaid
sequenceDiagram
  participant B as Browser
  participant UI as Next.js
  participant API as NestJS
  participant DB as PostgreSQL
  participant WS as Socket.io clients

  B->>UI: Create Product (form)
  UI->>API: POST /products (JWT cookie)
  API->>DB: INSERT Product
  DB-->>API: product
  API->>WS: emit "productUpdated"
  API-->>UI: product
  UI-->>B: revalidate products list (on WS event)
```

### 4) Stripe Checkout + webhook

```mermaid
sequenceDiagram
  participant B as Browser
  participant UI as Next.js
  participant API as NestJS
  participant S as Stripe
  participant DB as PostgreSQL

  B->>UI: Click Buy
  UI->>API: POST /checkout/session {productId}
  API->>S: create checkout session (success_url, cancel_url)
  S-->>API: session.url
  API-->>UI: session.url
  UI-->>B: window.location = session.url

  S-->>API: POST /checkout/webhook (checkout.session.completed)
  API->>S: retrieve session
  API->>DB: UPDATE Product SET sold=true
```

---

## Auth & Session Details

- Backend login cookie:
  - Cookie name: **`Authentication`**
  - Value: **JWT**
  - HttpOnly: **true**
  - In code, `secure: true` is set → on plain HTTP localhost, the browser may refuse to store the cookie.
    - For local dev you can:
      - run over HTTPS, or
      - set `secure: false` in `AuthService.login()` (dev only)

Frontend:
- `tashop-ui/app/auth/action/authenticated.ts` reads and returns the raw JWT string (used by WebSocket auth).
- `tashop-ui/proxy.ts` redirects unauthenticated users to `/auth/login`.

---

## WebSocket (Socket.io) Auth

Backend:
- `ProductsGateway.handleConnection()` extracts the JWT from `client.handshake.auth.Authentication` and validates it via `AuthService.verifyToken()`.
- Missing/invalid tokens lead to **disconnect** (no backend crash).
- Product changes emit `productUpdated` to all clients.

Frontend:
- `ProductsGrid` calls `authenticated()` to get the JWT, then connects:
  - `io(API_URL, { auth: { Authentication: token } })`
- On `productUpdated`, it calls `revalidateProducts()`.

---

## Product Images (Upload + Static Serving)

Backend:
- Upload endpoint: `POST /products/:productId/image` (JWT required)
- Saved via `multer` disk storage:
  - Path: `tashop-backend/public/images/products/`
  - Filename: `{productId}.png`
- Static serving: `ServeStaticModule` rootPath `public`, serveRoot `/`
  - Image URL: `http://localhost:3003/images/products/{id}.png`

Frontend:
- Cards load images from `API_URL + /images/products/{id}.png`.
- Next Image remotePatterns in `next.config.ts` allow `localhost:3003`.

---

## API Endpoints (summary)

> Note: many routes are protected by JWT guard.

- **Auth**
  - `POST /auth/login` (LocalAuthGuard) → sets cookie
- **Users**
  - depends on `tashop-backend/src/users`
- **Products**
  - `GET /products?status=availible` (JWT)
  - `GET /products/:productId` (JWT)
  - `POST /products` (JWT)
  - `POST /products/:productId/image` (JWT, multipart/form-data)
- **Checkout**
  - `POST /checkout/session` (JWT)
  - `POST /checkout/webhook` (Stripe)

---

## Local Development Setup

### 1) Backend

```bash
cd tashop-backend
npm install
```

Example `.env`:

```bash
PORT=3003
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tashop?schema=public"
JWT_SECRET="super-secret"
JWT_EXPIRATION="1d"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_SUCCESS_URL="http://localhost:3000/checkout/success"
STRIPE_CANCEL_URL="http://localhost:3000/"
```

Migrate + generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Run backend:

```bash
npm run start:dev
```

### 2) Frontend

```bash
cd tashop-ui
npm install
```

Example `.env`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3003"
```

Run frontend:

```bash
npm run dev
```

URLs:
- UI: `http://localhost:3000`
- API: `http://localhost:3003`

---

## Notes / Possible Improvements

- **Stripe webhook security**: webhook signature verification (raw body) should be added for production.
- **Cookie secure flag**: correct for production; may need dev-only override on HTTP localhost.
- **CORS**: backend uses `cors: true` (for production, restrict origins).
- **Upload file type**: filename is always `.png`. If you upload JPEG/WEBP, it still becomes `.png`; production should handle extension/mime consistently.

---

## Scripts

Backend (`tashop-backend/package.json`):
- `npm run start:dev`, `npm run build`, `npm run test`

Frontend (`tashop-ui/package.json`):
- `npm run dev`, `npm run build`, `npm run lint`


