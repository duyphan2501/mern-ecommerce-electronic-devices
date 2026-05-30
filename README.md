# MERN Ecommerce — Electronic Devices

A full-stack ecommerce application for electronic devices, built with a **3-tier monorepo architecture**: customer storefront, admin dashboard, and REST API backend. The project tackles real-world ecommerce engineering challenges including **concurrent inventory management**, **stateless JWT authentication**, **guest cart with seamless merge on login**, and **live payment webhook integration**.

> **Stack:** ReactJS · Node.js · Express.js · MongoDB · Redis

---

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Client (5173)  │     │  Admin  (5174)  │
│  React + Vite   │     │  React + Vite   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └──────────┬────────────┘
                    │  REST API  /  HTTP-only Cookie
         ┌──────────▼────────────┐
         │    Express.js API     │  ← JWT Auth Middleware
         │      (Port 3000)      │  ← Role-based Access Control
         └───┬──────────┬────────┘
             │          │
    ┌────────▼──┐  ┌────▼────────────┐
    │  MongoDB  │  │      Redis      │
    │ (8 models)│  │ Stock · Cart ·  │
    │           │  │ Reservation     │
    └───────────┘  └─────────────────┘
             │
    ┌────────▼─────────────┐
    │  Cloudinary  (media) │
    │  PayOS       (pay)   │
    │  Nodemailer  (email) │
    └──────────────────────┘
```

---

## Technical Highlights

### Guest Cart with Login Merge
Unauthenticated users get a `cartId` cookie and a fully functional cart stored in Redis — items are stock-reserved just like a logged-in user, but with a shorter TTL (3 days vs. 7 days). On login, a **Lua script (`MERGE_CART_LUA`)** atomically transfers all guest reservations to the user's account in a single Redis round-trip, then syncs the result to MongoDB via `bulkWrite`.

```
Redis layout:
  cart:{guestId}                  → Hash  { "product:{modelId}": qty }
  reservation:{guestId}:{modelId} → Hash  { qty, expireAt }

On login:
  MERGE_CART_LUA  →  release guest reservation
                  →  accumulate into user reservation
                  →  update user cart hash
                  →  re-register in reservation:zset
  MongoDB bulkWrite → sync final quantities
  DEL cart:{guestId}
```

### Concurrent Inventory with Redis + Lua
Stock reservation runs as an **atomic Lua script** directly in Redis, eliminating race conditions when multiple users checkout the same product simultaneously — no application-level locks needed. Stock data is bootstrapped from MongoDB into Redis on server start (`rebuildStockRedis`).

```
Redis keys:
  stock:{modelId}              → { available, reserved }
  reservation:{ownerId}:{modelId} → { qty, expireAt }
  reservation:zset             → sorted set by expireAt (for reclaim)
```

An **inventory worker** runs every 30 seconds to reclaim reservations from abandoned carts, returning stock to the available pool.

### JWT Auth — Dual Token Strategy
- **Access Token** (short-lived) stored in HTTP-only cookie, verified on every protected request
- **Refresh Token** used to silently re-issue access tokens without re-login
- `checkAuth` and `checkAdmin` middleware enforce role-based access at route level

### PayOS Payment + Webhook
Flow: create payment link → redirect to PayOS → receive signed webhook → verify checksum → update order status. In development, **ngrok** tunnels localhost to expose the webhook endpoint to PayOS.

### Image Upload via Cloudinary
Product and category images are piped through **Multer** (memory storage) directly to Cloudinary. Public IDs are persisted in MongoDB so old images can be deleted on update — no orphaned files.

---

## Features

**Storefront:** Register / Login / Google OAuth · Email verification · Browse by category & brand · Product detail with image zoom · Real-time cart (guest + authenticated) · Checkout & PayOS payment · Order tracking · Shipping address management · Change password

**Admin Dashboard:** Statistics & charts (Recharts) · Category, product & order management · Multi-image upload · TipTap rich-text product description editor · Secure login

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Zustand, React Router v7, Axios |
| **UI Components** | MUI, Ant Design, Framer Motion, Swiper |
| **Backend** | Node.js, Express.js v5, ES Modules |
| **Database** | MongoDB, Mongoose (8 models) |
| **Cache / Queue** | Redis — stock reservation, cart storage, pub/sub |
| **Auth** | JWT (Access + Refresh Token), Google OAuth 2.0, bcryptjs |
| **Storage** | Cloudinary, Multer |
| **Payment** | PayOS, ngrok (dev webhook tunnel) |
| **Email** | Nodemailer |

---

## Project Structure

```
├── client/                  # Customer storefront
│   └── src/
│       ├── pages/           # Home, ProductDetail, Cart, Checkout, Order...
│       ├── components/      # CartDrawer, ProductCard, AddressForm...
│       ├── store/           # Zustand global state
│       └── hooks/           # Custom React hooks
│
├── admin/                   # Admin dashboard
│   └── src/
│       ├── Pages/           # Dashboard, Products, Orders, Category, Login
│       └── components/      # CategoryTable, OrderTable, TipTap editor...
│
└── server/                  # REST API
    ├── routes/              # user, product, cart, order, payment, brand, address
    ├── controller/          # Request handlers & business logic
    ├── model/               # Mongoose schemas
    ├── middleware/           # auth, error handler, cloudinary upload
    ├── service/             # StockService, CartService (Redis Lua)
    ├── workers/             # Inventory reclaim worker (30s interval)
    ├── scripts/             # Lua scripts: RESERVE, RECLAIM, MERGE_CART, CONFIRM_ORDER
    ├── config/              # MongoDB, Redis, Cloudinary, PayOS init
    └── helper/              # JWT utils, slugify, cart formatter
```

---

## Database Models

`User` · `Category` · `Brand` · `Product` · `ProductModel` (variants) · `Cart` · `Address` · `Order`
