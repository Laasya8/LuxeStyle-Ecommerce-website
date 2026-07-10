# LuxeStyle

Production-grade MERN e-commerce platform — React 19 + Vite + Tailwind client, Node/Express/MongoDB server, Clerk auth, Cloudinary images, Cash-on-Delivery checkout.

Built in phases:
1. **Foundation** — project scaffold, DB models, Clerk auth wiring *(done)*
2. Product catalog & browsing
3. Cart, wishlist, checkout, orders
4. Admin dashboard
5. Hardening & deployment prep

## Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Clerk](https://dashboard.clerk.com) application
- A [Cloudinary](https://cloudinary.com/console) account

## 1. MongoDB Atlas

1. Create a free cluster.
2. **Database Access** → add a user with a password.
3. **Network Access** → allow your IP (or `0.0.0.0/0` for local dev).
4. **Connect → Drivers** → copy the connection string.
5. Paste it into `server/.env` as `MONGODB_URI` (swap in your password and a database name, e.g. `/luxestyle`).

## 2. Clerk

1. Create an application at dashboard.clerk.com. Enable **Email** and **Google** as sign-in options.
2. **API Keys** → copy the **Publishable key** into `client/.env` (`VITE_CLERK_PUBLISHABLE_KEY`) and both `client/.env`/`server/.env` (`CLERK_PUBLISHABLE_KEY`).
3. Copy the **Secret key** into `server/.env` as `CLERK_SECRET_KEY`.
4. **Webhooks** → add an endpoint pointing at `https://<your-public-server-url>/api/webhooks/clerk`, subscribed to `user.created`, `user.updated`, `user.deleted`. Copy the **Signing Secret** into `server/.env` as `CLERK_WEBHOOK_SECRET`.
   - Webhooks require a publicly reachable URL. For local dev without one, user records still sync automatically on first authenticated API call (see `server/middleware/auth.js`) — the webhook just makes sync real-time and covers deletes.
5. To make a user an admin, manually set their Mongo `User.role` to `"admin"` (e.g. via MongoDB Atlas' data browser) after they've signed in once.

## 3. Cloudinary

1. From the console dashboard, copy **Cloud name**, **API Key**, and **API Secret** into `server/.env`.

## Running locally

```bash
# Server
cd server
cp .env.example .env   # fill in real values
npm install
npm run dev             # http://localhost:5000

# Client (separate terminal)
cd client
cp .env.example .env   # fill in real values
npm install
npm run dev             # http://localhost:5173
```

Both apps boot even with placeholder `.env` values — you'll see console warnings for whichever services aren't configured yet, and the UI shows a setup notice on auth-gated pages until Clerk is wired up.

## Project structure

```
client/   React 19 + Vite + Tailwind CSS storefront & admin UI
server/   Express REST API, MongoDB models, Clerk/Cloudinary integration
```

See `client/src` and `server/` for the full folder breakdown (components, context, hooks, layouts, pages, routes, services, utils / config, controllers, middleware, models, routes, utils).
