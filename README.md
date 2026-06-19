# MERN Ecommerce - Electronic Devices

## Description

This project is a full-stack ecommerce system for selling electronic devices. It includes a customer storefront, an admin dashboard, and a REST API backend in one monorepo.

The application focuses on real ecommerce problems, not only basic CRUD. It supports authentication, product browsing, product variants, guest carts, login cart merging, checkout, PayOS payment, order management, inventory control, media uploads, and admin operations.

Main users:

- Customers can browse products, manage carts, checkout, pay, and track orders.
- Admin users can manage products, categories, brands, orders, inventory, slides, services, blogs, and site settings.

## Architecture

The project uses a three-tier MERN architecture:

```text
Customer Storefront          Admin Dashboard
React + Vite                 React + Vite
localhost:5173               localhost:5174
       |                            |
       +------------ REST API ------+
                    |
              Express Backend
              localhost:3000
                    |
      +-------------+--------------+
      |                            |
   MongoDB                       Redis
   persistent data               cache, cart,
                                 stock reservation
      |
External services:
Cloudinary, PayOS, Nodemailer, Google OAuth, ngrok
```

Application folders:

```text
.
|-- client/   Customer storefront
|-- admin/    Admin dashboard
`-- server/   Express API, services, models, routes, workers
```

Backend route groups:

- `/api/user`
- `/api/category`
- `/api/product`
- `/api/cart`
- `/api/address`
- `/api/payment`
- `/api/order`
- `/api/brand`
- `/api/inventory`
- `/api/slides`
- `/api/services`
- `/api/blogs`
- `/api/settings`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Customer Frontend | React 19, Vite, Tailwind CSS v4, Zustand, React Router, Axios |
| Admin Frontend | React 19, Vite, Tailwind CSS v4, MUI, Ant Design, TipTap, Recharts, Zustand |
| Backend | Node.js, Express 5, ES Modules |
| Database | MongoDB, Mongoose |
| Cache / Inventory | Redis |
| Authentication | JWT, HTTP-only cookies, Google OAuth, bcryptjs |
| Media Storage | Cloudinary, Multer |
| Payment | PayOS |
| Email | Nodemailer |
| Development Tools | ngrok, nodemon, ESLint |

## Features

### Customer Features

- Register, login, logout, email verification, and password reset
- Google OAuth login
- Browse products by category and brand
- View product details with images, variants, and zoom
- Use cart as guest or authenticated user
- Merge guest cart into user cart after login
- Manage shipping addresses
- Checkout and create orders
- Pay through PayOS payment link
- Track order status
- View order history, cancel orders, and reorder
- Manage profile, avatar, and password

### Admin Features

- Secure admin login
- Dashboard statistics and charts
- Manage categories, brands, products, and product models
- Upload product and category images
- Manage orders and order statuses
- Manage inventory, stock imports, stock exports, and stock movement history
- Manage homepage slides, service blocks, blogs, and common site settings
- Edit rich product/blog content with TipTap

### Backend Features

- REST API with Express
- Cookie-based JWT authentication
- Access token and refresh token flow
- Role-based authorization for admin routes
- MongoDB data persistence
- Redis cart and inventory reservation system
- Atomic Lua scripts for critical stock/cart operations
- Inventory worker for expired reservation reclaim
- Cloudinary upload flow
- PayOS payment and webhook verification
- Centralized error handling

## Technical Highlights

### 1. Frontend Performance and UX Techniques

The customer storefront and admin dashboard use practical frontend techniques to improve loading speed, SEO, authentication flow, and user experience.

Frontend highlights:

- Lazy loading and route-based code splitting for faster initial page loads
- Image lazy loading for product galleries, banners, category images, and blog thumbnails
- SEO-friendly page metadata for product and storefront pages
- Axios interceptors for attaching credentials, handling expired access tokens, refreshing sessions, and centralizing API errors
- Protected routes for customer-only pages and admin-only dashboard screens
- Responsive Tailwind CSS layouts for product grids, checkout pages, dashboards, and forms
- Product gallery interactions such as image preview, zoom, variant switching, and stock-aware selection
- Admin data tables, filters, charts, and rich text editing for operational workflows

These highlights make the frontend closer to a production ecommerce experience: faster to load, easier to navigate, and more reliable during authentication and checkout.

### 2. Guest Cart and Login Merge

Unauthenticated users receive a `cartId` cookie. Their cart is stored in Redis and can reserve stock like a normal user cart.

When the user logs in, the system merges the guest cart into the authenticated cart. This avoids losing selected items and creates a smoother checkout experience.

Key idea:

```text
Guest cart in Redis
        |
        | login
        v
Merge guest reservations into user reservations
        |
        v
Sync final cart state to MongoDB
```

### 3. Concurrent Inventory Reservation

The project uses Redis and Lua scripts for stock reservation. This keeps stock updates atomic, so two users cannot reserve the same final item at the same time.

Redis tracks:

- Available stock
- Reserved stock
- Reservation owner
- Reservation expiration time

### 4. Expired Reservation Reclaim

An inventory worker runs periodically and releases expired cart reservations. This returns abandoned stock back to the available pool.

This prevents products from staying locked forever when users add items to cart but never complete checkout.

### 5. JWT Authentication with Refresh Token

The backend uses:

- Access token for protected API requests
- Refresh token to issue new access tokens
- HTTP-only cookies to reduce token exposure in frontend JavaScript
- Middleware to protect customer and admin routes

### 6. PayOS Payment Integration

The checkout flow creates a PayOS payment link. After payment, PayOS sends webhook data to the backend. The backend verifies the webhook checksum before updating payment and order status.

In local development, ngrok can expose the backend webhook endpoint.

### 7. Cloudinary Upload Pipeline

Images are uploaded through Multer and sent to Cloudinary. The database stores Cloudinary image metadata, allowing product/category images to be managed without storing files directly in the repository.

## Database

The backend uses MongoDB with Mongoose models.

Main collections:

| Model | Purpose |
| --- | --- |
| `User` | Customer/admin accounts, auth data, profile data |
| `Category` | Product categories |
| `Brand` | Product brands |
| `Product` | Main product information |
| `ProductModel` | Product variants/models such as color, storage, stock, price |
| `Cart` | Authenticated user cart snapshot |
| `Address` | Customer shipping addresses |
| `Order` | Orders, payment status, shipping status, order items |
| `Return` | RMA/return data |
| `GoodsReceipt` | Inventory import records |
| `StockExport` | Inventory export records |
| `InventoryMovement` | Stock movement history |
| `Slide` | Homepage/banner slides |
| `Service` | Service display content |
| `Blog` | Blog/content posts |
| `Setting` | Common website settings |

Redis is used for fast-changing operational data:

- Cart hashes
- Stock availability
- Stock reservations
- Reservation expiration sorted set

## Result

The result is a working ecommerce platform with separate customer and admin experiences.

Completed outcomes:

- Customers can browse products, add items to cart, checkout, pay, and track orders.
- Admins can manage catalog, orders, inventory, and site content.
- Stock is protected from overselling through Redis atomic reservation.
- Guest carts persist and merge after login.
- Payment, image upload, email, and OAuth services are integrated.
- The codebase is separated into clear frontend, backend, service, model, route, and worker layers.

## Run Locally

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

Start each app:

```bash
cd server
npm run dev

cd ../client
npm run dev

cd ../admin
npm run dev -- --port 5174
```

Default URLs:

- Customer storefront: `http://localhost:5173`
- Admin dashboard: `http://localhost:5174`
- API health check: `http://localhost:3000/ping`

## Environment Variables

Create `.env` files in `server/`, `client/`, and `admin/`.

### `server/.env`

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
BACKEND_URL=http://localhost:3000
MONGODB_URI=
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=
ACCESS_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY=
GOOGLE_CLIENT_ID=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
PAYOS_CLIENT_ID=
PAYOS_API_KEY=
PAYOS_CHECKSUM_KEY=
EMAIL_USERNAME=
EMAIL_APP_PASSWORD=
```

### `client/.env`

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=
```

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLIENT_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=
```
