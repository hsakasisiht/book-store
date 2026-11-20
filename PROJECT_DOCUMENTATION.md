# BRIVON / PageHaven — Full-Stack Project Documentation & Architecture Guide

> **Project Identity:** BRIVON — Independent Publisher & Rare Book Archive (`jyoti-project`)  
> **Architecture Pattern:** MERN (MongoDB, Express.js, React, Node.js) with decoupled Cloud Deployment  
> **Repository:** `https://github.com/hsakasisiht/book-store`  
> **Live Web Application:** [https://pagehaven-frontend.onrender.com](https://pagehaven-frontend.onrender.com)  
> **Live REST API:** [https://pagehaven-backend.onrender.com](https://pagehaven-backend.onrender.com)  

---

## 1. Executive Summary

**BRIVON** (also referenced as **PageHaven**) is a modern, high-performance, full-stack digital bookstore and rare monograph archival system. It provides an editorial storefront for collectors and readers, accompanied by a secured, role-based administrative dashboard for managing catalogue inventories, disciplines/categories, and order dispatch workflows.

The application avoids generic templates in favor of a custom design system characterized by **Matte Carbon Obsidian (`#0A0B0E`)**, **Electric Acid Lime (`#CCFF00`)**, crisp typography (**Syne** & **Space Mono**), architectural card radii, and responsive layouts.

---

## 2. Core Programming Languages & Runtimes

| Language / Runtime | Version / Flavor | Usage & Scope |
| :--- | :--- | :--- |
| **JavaScript (ECMAScript 2024+)** | Native ES Modules (`"type": "module"`) | Used exclusively across the entire stack (both frontend and backend) with modern ES syntax, `async/await`, optional chaining, and dynamic imports. |
| **HTML5 & Modern CSS3** | Semantic HTML & Custom Design Tokens | Structured with semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`). Styled using modern CSS variables, CSS grid, flexbox, and zero third-party UI framework overhead (no Bootstrap or Tailwind bloat). |
| **Node.js** | v24 LTS | Server-side runtime executing the Express REST API, data seeders, and automated test runners. |
| **PowerShell / Bash** | Windows PowerShell 5.1 / Core | Used for automated local workflows, git synchronization, and Render API orchestration scripts. |

---

## 3. Technology Stack & Architectural Overview

The application is structured into three clean, decoupled layers:

```
┌────────────────────────────────────────────────────────┐
│             Frontend SPA (Client Layer)                │
│  React 19 • Vite 8 • React Router 7 • Context State    │
│  Hosted on Render Global CDN (Static Site)             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON REST API
                           ▼
┌────────────────────────────────────────────────────────┐
│              Backend (API Application Layer)           │
│  Node.js • Express 4 • JWT Auth • RBAC Middleware      │
│  Hosted on Render Cloud Linux Container (Web Service)  │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM / SRV Connection
                           ▼
┌────────────────────────────────────────────────────────┐
│             Database (Cloud Storage Layer)             │
│  MongoDB Atlas Cloud M0 Cluster • Replica Set          │
│  Partition: jyoti_bookstore                            │
└────────────────────────────────────────────────────────┘
```

---

## 4. Third-Party Libraries & How They Are Used

### 4.1 Backend Libraries (`server/package.json`)

| Package | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **`express`** | `^4.21.2` | Core backend HTTP framework. Handles URL routing, CORS management, request body parsing (`express.json()`), route-level middleware, and centralized error handling. |
| **`mongoose`** | `^8.9.5` | Object Data Modeling (ODM) library for MongoDB. Enforces strict schemas, validation rules, relationship references (ObjectId populate), and query lifecycle hooks. |
| **`jsonwebtoken`** | `^9.0.2` | Implements Stateless JSON Web Token (JWT) authorization. Issues signed tokens upon login/register, verified on incoming secured requests via `authenticate` middleware. |
| **`bcryptjs`** | `^3.0.3` | Cryptographic hashing for user passwords. Automatically hashes raw passwords with a salt factor of 10 during user creation and verifies hashes during authentication. |
| **`cors`** | `^2.8.5` | Cross-Origin Resource Sharing middleware. Enables safe communication between the frontend domain and backend API domain while allowing preflight OPTIONS checks. |
| **`dotenv`** | `^17.3.1` | Loads local environment variables from `.env` files into `process.env`. |
| **`nodemon`** | `^3.1.9` | Development file watcher that automatically restarts the Node server upon code changes. |

### 4.2 Frontend Libraries (`client/package.json`)

| Package | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **`react`** | `^19.3.1` | Modern declarative UI component library using Functional Components and Hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`). |
| **`react-dom`** | `^19.3.1` | Renders React components into the browser DOM tree (`createRoot`). |
| **`react-router-dom`** | `^7.18.5` | Client-side routing for Single Page Applications (SPA). Manages URL routing without page reloads, dynamic route parameters (`:id`, `:slug`), and protected routes. |
| **`vite`** | `^8.3.6` | Next-generation frontend build tool and dev server. Bundles code with Rollup, provides instant Hot Module Replacement (HMR), and tree-shakes production builds. |
| **`@vitejs/plugin-react`** | `^6.1.2` | Vite plugin providing fast JSX/TSX transformations using Babel/SWC. |
| **`oxlint`** | `^1.90.0` | Ultra-fast Rust-based linter for validating code style, catching syntax traps, and preventing regressions. |

---

## 5. Database Schema & Data Models (`server/src/models/`)

The MongoDB database contains 5 core collections designed with relational integrity:

### 1. `User.js`
- **Fields:** `name` (String), `email` (Unique String), `password` (Hashed String), `role` (Enum: `'customer'` or `'admin'`), `phone` (String), `addresses` (Array of Address sub-documents).
- **Methods:** `hashPassword(rawPassword)` static helper; `comparePassword(candidatePassword)` instance verification method.
- **Security:** Password field is automatically excluded from responses unless explicitly queried.

### 2. `Category.js`
- **Fields:** `name` (String, required), `slug` (Unique String, URL-friendly index), `description` (String), `icon` (String, SVG identifier).
- **Purpose:** Organizes monographs into curated aesthetic disciplines (e.g., *Graphic Design & Typography*, *Architecture & Spatial*, *Photography & Monograph*, *Critical Theory & Aesthetics*).

### 3. `Book.js`
- **Fields:** `title` (String), `author` (String), `isbn` (String), `price` (Number), `salePrice` (Number, optional), `categoryId` (ObjectId ref `'Category'`), `coverImage` (URL String), `description` (String), `stockCount` (Number, default 10), `publishedYear` (Number), `publisher` (String), `featured` (Boolean), `specifications` (Sub-document: format, binding, dimensions, page count, paper stock).
- **Indexing:** Text indexes on `title`, `author`, and `isbn` for instantaneous full-text catalogue search.

### 4. `Cart.js`
- **Fields:** `userId` (ObjectId ref `'User'`), `items` (`[ { bookId, quantity, unitPrice } ]`), `updatedAt` (Date).
- **Purpose:** Server-side persistent shopping bag that persists across client devices and sessions.

### 5. `Order.js`
- **Fields:** `userId` (ObjectId ref `'User'`), `orderNumber` (Unique String), `items` (`[ { bookId, title, price, quantity, coverImage } ]`), `shippingAddress` (Sub-document), `paymentStatus` (Enum: `'pending'`, `'paid'`, `'failed'`), `orderStatus` (Enum: `'pending'`, `'confirmed'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`), `totalAmount` (Number), `createdAt` (Timestamp).

---

## 6. REST API Endpoints Specification

All backend endpoints are prefixed with `/api`.

| HTTP Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System health status, uptime monitor, and timestamp |
| **GET** | `/api` | Public | Root welcome endpoint |
| **POST** | `/api/auth/register` | Public | Create new customer account; returns user profile and JWT |
| **POST** | `/api/auth/login` | Public | Authenticate user; returns signed JWT token and role |
| **GET** | `/api/auth/profile` | Authenticated | Fetch current authenticated user's profile and order count |
| **PUT** | `/api/auth/profile` | Authenticated | Update user name, phone, or delivery address |
| **GET** | `/api/categories` | Public | Fetch all available categories |
| **GET** | `/api/categories/:slug` | Public | Fetch single category details by slug |
| **GET** | `/api/books` | Public | Search and filter books (with pagination, sort, category filter) |
| **GET** | `/api/books/:id` | Public | Retrieve complete book specifications and details |
| **GET** | `/api/cart` | Authenticated | Retrieve user's server-stored shopping bag |
| **POST** | `/api/cart/items` | Authenticated | Add monograph to cart or increment quantity |
| **PUT** | `/api/cart/items/:bookId` | Authenticated | Update quantity of a cart item |
| **DELETE** | `/api/cart/items/:bookId` | Authenticated | Remove an item from the cart |
| **DELETE** | `/api/cart` | Authenticated | Clear all items from the cart |
| **POST** | `/api/orders` | Authenticated | Place a new order, deduct book stock, and clear cart |
| **GET** | `/api/orders/my-orders` | Authenticated | Retrieve authenticated user's order history |
| **GET** | `/api/orders/:id` | Authenticated | Retrieve complete receipt and tracking details for an order |
| **GET** | `/api/admin/metrics` | Admin Only | High-level metrics: total revenue, order volume, low stock |
| **GET** | `/api/admin/orders` | Admin Only | Administrative order fulfillment desk with status controls |
| **PUT** | `/api/admin/orders/:id/status` | Admin Only | Advance order status (`pending` &rarr; `shipped` &rarr; `delivered`) |
| **POST** | `/api/admin/books` | Admin Only | Add a new book edition to the inventory |
| **PUT** | `/api/admin/books/:id` | Admin Only | Update pricing, description, or restock inventory |
| **DELETE** | `/api/admin/books/:id` | Admin Only | Remove or archive a book listing |

---

## 7. Frontend State Architecture & User Experience

The client is built as an interactive Single-Page Application (SPA) driven by React 19 and React Router 7:

### 7.1 State Providers (`client/src/context/`)
1. **`AuthContext.jsx`**: Manages token storage in `localStorage`, user session recovery on page refresh, login, registration, and logout operations.
2. **`CartContext.jsx`**: Synchronizes local optimistic cart state with server database endpoints. Calculates subtotals, shipping thresholds, and badge counts.
3. **`ThemeContext.jsx`**: Handles theme switches and persists visual preference.

### 7.2 Routing & Layouts (`client/src/layouts/`)
- **`StoreLayout.jsx`**: Public layout housing the BRIVON navigation bar, live collector bag counter, search trigger, and editorial footer.
- **`AdminLayout.jsx`**: Restricted layout housing the studio management sidebar, metrics snapshot, inventory controls, and status controls.
- **Route Masking Security**: Unauthorized customers who navigate to `/admin` are presented with a clean 404 Not Found screen, preventing leakage of admin route structure.

---

## 8. Cloud Hosting & DevOps Architecture

### 8.1 Deployment on Render
Both services are configured via Infrastructure-as-Code in [`render.yaml`](./render.yaml):

1. **Backend Web Service (`pagehaven-backend`)**:
   - **Environment:** Node.js
   - **Plan:** Free Tier
   - **Region:** Singapore (`singapore`)
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`

2. **Frontend Static Site (`pagehaven-frontend`)**:
   - **Environment:** Static
   - **Plan:** Free Tier (Global Edge CDN)
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **SPA Routing Rewrite Rule:** `/*` &rarr; `/index.html` (Prevents 404s on browser reloads)
   - **Environment Variable:** `VITE_API_URL=https://pagehaven-backend.onrender.com/api`

### 8.2 Windows Node.js DNS SRV Resolution Fix
On Windows networks, Node's built-in `c-ares` DNS resolver can trigger `querySrv ECONNREFUSED` when resolving MongoDB Atlas `mongodb+srv://` connection strings. 
To guarantee bulletproof connectivity locally and in cloud containers, [`server/src/config/database.js`](./server/src/config/database.js) and [`server/src/scripts/seed.js`](./server/src/scripts/seed.js) set resilient public DNS fallbacks:
```javascript
import dns from 'node:dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Graceful fallback
}
```

---

## 9. Security & Hardening Protocols

1. **Environment Secrets Protection**: All `.env`, `*.env`, and credential files are strictly blocked in [`.gitignore`](./.gitignore).
2. **Password Security**: Passwords hashed using one-way bcrypt with auto-generated salt rounds.
3. **Role-Based Access Control (RBAC)**: Backend endpoints verify `req.user.role === 'admin'` before allowing inventory or order mutations.
4. **CORS Governance**: Configured in Express to accept requests from both local dev servers and the live Render production frontend.
5. **Inventory Validation**: Order processing checks real-time database stock levels before confirming an order, preventing negative inventory.

---

## 10. Local Development & Reproduction Commands

### Prerequisites
- Node.js v18+ (Node.js v24 recommended)
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/hsakasisiht/book-store.git
cd book-store

# Install root, client, and server dependencies
npm run build
```

### Seeding Data
```bash
# Populates categories, books, and demo accounts in MongoDB Atlas
npm run seed
```

### Starting Servers Locally
```bash
# Run server on port 5001
cd server && npm run dev

# In a second terminal, run client on port 5174
cd client && npm run dev
```

### Running Automated Acceptance Tests
```bash
npm run test:acceptance
```
*Verifies 11 key flows: authentication, JWT integrity, role enforcement, stock decrementing, and order creation.*
