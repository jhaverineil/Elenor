# 🧠 ELENOR AI Training & Context Manual

> **Outdated (October 2026):** the haircare storefront, cart, checkout and customer accounts described below were retired to `legacy/`. Elenor is now an enquiry-led brand site. See `HANDOVER.md` for the current architecture; the MVC layering notes below still apply.

> **FOR THE ATTENTION OF THE INCOMING AI ASSISTANT**: Read this file in its entirety before making any code changes. This project has been meticulously built to a 10/10 MVC standard. Maintain this integrity.

---

## 📖 1. Project Context & Genesis
This project started as a basic "Zenith One" watch landing page and was completely rebranded into **ELENOR Luxury Haircare**.
- **The Brand**: ELENOR is a high-end, salon-exclusive haircare line.
- **The Product**: "Noir Repair Collection" — a premium keratin-based kit.
- **Target Market**: Indian luxury market (Currency: **INR ₹**, Base Price: **4,999.00**).
- **Design Ethos**: "Glassmorphism" (frosted glass, gradients, high-end shadows) using the **Outfit** font.

---

## 🏗 2. Architecture: The "9/10 to 10/10" MVC Journey
Initially, the project was "Headless" (logic in components). We refactored it into a professional MVC structure:
1. **Model Layer (`src/models/`)**: Abstracts Supabase CRUD. Never query DB directly in components.
2. **Service Layer (`src/services/`)**: Abstracts API calls and Auth logic. Components should call services, not `fetch`.
3. **View Layer (`src/components/`, `src/app/`)**: Dumb/Presentational components.
4. **Controller Layer (`src/app/api/`)**: Zod-validated API routes.
5. **State Layer (`src/store/`)**: Zustand persistent cart (`elenor-cart`).

---

## 🛠 3. Technical Implementation Details
- **Auth**: Google OAuth + Email/Password (Supabase Auth). 
- **Validation**: Every API request is validated via **Zod**.
- **Security**: 
  - `src/middleware.ts` handles route protection (Cart check for checkout, Auth check for signin).
  - `next.config.ts` applies strict HTTP Security Headers (XSS, Clickjacking, CSP).
- **Startup Safety**: `src/lib/env.ts` validates all environment variables at boot.
- **Automation**: Orders trigger an **n8n webhook** for fulfillment (Google Sheets/Email).

---

## 📝 4. Conversion Log: Key Small Decisions
- **Quantity Selector**: Added to Hero to allow multiple-unit "Add to Bag".
- **Product Media**: 
  - Main Product: `public/elenor-product.jpg` (Luxury white bottles).
  - Lifestyle: `public/lifestyle.png` (High-res shiny hair shot).
- **Cart Persistency**: Managed via `zustand/middleware/persist`.
- **Checkout**: Supports "Guest Checkout" but pre-fills data if the user is logged in via Supabase.

---

## 🚀 5. How to Setup (Training for the next AI)
If you are the new AI assistant, follow these steps to "wake up" the project:

1. **Verify Files**: Ensure `supabase_schema.sql` and `.env.example` exist.
2. **SQL Setup**: Tell the user to run `supabase_schema.sql` in their Supabase dashboard.
3. **Env Check**: Help the user rename `.env.example` to `.env.local` and fill the keys.
4. **Dependency Sync**: Run `npm install`.
5. **Validation**: Run `npx tsc --noEmit` to ensure no types are broken.

---

## 🎯 6. Remaining 10/10 Roadmap
The project is currently at a 9/10 score. To hit 10/10, you must:
1. **Unit Testing**: Add `vitest` and test the `order.model.ts` and `orderService.ts`.
2. **Server-Side Fetch**: Convert the Home page to a Server Component and fetch product data from `products` table instead of using `src/constants/index.ts`.

---
*Signed, Antigravity AI.*
