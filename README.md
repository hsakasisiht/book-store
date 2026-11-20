# BRIVON — Independent Publisher & Rare Book Archive (`jyoti-project`)

> A bespoke, full-stack MERN editorial bookstore built from scratch with an authentic **Brivon Studio Aesthetic**: Electric Acid Lime (`#CCFF00`), Matte Carbon Obsidian (`#0A0B0E`), Syne Ultra-bold & Space Mono typography, razor-sharp hairline borders, pill capsules, and zero AI clichés.

---

## 🎨 Visual Identity & Architecture

| Element | Specification |
| :--- | :--- |
| **Brand Identity** | **BRIVON** (*"Print lives in the work, not the screen." / "Craft over noise"*) |
| **Display Headings** | **`Syne` (800 / 900 Ultra-bold Uppercase)** |
| **Technical Eyebrows & Metadata** | **`Space Mono`** (`• BROOKLYN • BERLIN • TOKYO • EST. 2014`, `35MM • 300GSM MUNKEN PURE • SWISS BINDING`) |
| **UI Controls & Section Headers** | **`Space Grotesk`** (Tight geometric grotesque) |
| **Reading & Body Text** | **`Plus Jakarta Sans`** (Refined, high-legibility editorial sans) |
| **Color Matrix** | Matte Obsidian (`#0A0B0E`), Charcoal Surface (`#111216`), Electric Acid Lime (`#CCFF00`), Pure White (`#FFFFFF`) |
| **Button Geometry** | **Pill Capsules (`border-radius: 9999px`)** with surgical high contrast |
| **Card & Plate Radii** | **20px–24px Architectural Plates** with hairline borders (`rgba(255, 255, 255, 0.08)`) |
| **Content Curation** | Legendary art monographs, Swiss typography, brutalist architecture, and critical aesthetics |
| **Icons & Embellishments** | Custom SVG line apertures and monospace badges — **Zero Emojis** |
| **Client Port** | `5174` |
| **Server Port** | `5001` |
| **Database** | MongoDB Atlas `/jyoti_bookstore` partition |

---

## 🚀 Quick Start Guide

### 1. Build Client Assets
```bash
npm run client:build
```

### 2. Seed Real Curated Monograph Archive
```bash
npm run seed
```

### 3. Run Development Servers
```bash
# Terminal 1: Client on Port 5174
cd client && npm run dev

# Terminal 2: API on Port 5001
cd server && npm run dev
```

- **Storefront & Admin Web App:** [http://localhost:5174](http://localhost:5174)
- **Backend REST API:** [http://localhost:5001/api](http://localhost:5001/api)
- **Health Check Endpoint:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔐 Demo Credentials

One-click demo credentials are built directly into the login form:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Studio Admin** | `admin@brivon.com` | `Admin@123` | Full Access: Inventory Management, Disciplines, Dispatch Fulfillment Desk |
| **Archive Collector** | `collector@brivon.com` | `Reader@123` | Curated Storefront, Dispatch Bag, Checkout, Order Tracking |

---

## 🛡️ Security & Privacy Mask
Standard customers who navigate to `/admin` are greeted with a clean 404 Not Found error page, keeping internal operations invisible.

---

## 🧪 Acceptance Testing
```bash
npm run test:acceptance
```
All 11 automated security, authorization, inventory deduction, and checkout acceptance tests pass.
