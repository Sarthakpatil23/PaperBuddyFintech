# 🚀 PaperBuddy Fintech - Production Deployment Guide

This document provides a complete, step-by-step deployment guide for the **PaperBuddy Fintech** platform.

---

## 🏗️ System Architecture Overview

| Component | Technology | Recommended Hosting | Why? |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite SPA) + Tailwind CSS + Framer Motion | **Vercel** | Lightning-fast static asset hosting, global CDN, instant Git deploys, free tier with custom domains. |
| **Backend** | Node.js + Express + Socket.IO + Node-cron | **Render** *(or Railway)* | Requires a persistent HTTP & WebSocket server process for real-time notifications and background cron jobs. |
| **Database** | PostgreSQL + Prisma ORM | **Neon PostgreSQL** | Serverless Postgres with built-in connection pooling (`PgBouncer`) and direct migration support. |
| **Authentication** | Clerk Auth | **Clerk Dashboard** | User identity management with built-in RBAC support. |

---

## ❓ Where Should You Deploy the Backend?

### Recommended Option 1: **Render (Render.com)** ⭐ *(Best Choice)*
- **Why Render?**
  - Native support for persistent **Node.js Web Services**.
  - Fully supports **WebSockets (`socket.io`)** out of the box without disconnection timeouts.
  - Keeps **Node-cron (`node-cron`)** background jobs running seamlessly in memory.
  - Free/Cheap tier with automatic HTTPS/SSL and GitHub CD integration.

### Recommended Option 2: **Railway (Railway.app)**
- **Why Railway?**
  - Excellent developer experience with instant GitHub builds.
  - Built-in metrics, zero-downtime deploys, and native WebSocket support.
  - Generous trial usage limits.

> ⚠️ **Why NOT deploy the backend on Vercel Serverless Functions?**  
> Vercel API routes are serverless (ephemeral execution). Serverless functions shut down after each HTTP request, which **breaks persistent WebSocket connections (`socket.io`)** and **stops background cron jobs (`node-cron`)**. Therefore, a dedicated Node container service like **Render** or **Railway** is required.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:
1. A **GitHub Repository** containing this codebase.
2. A **Vercel Account** ([vercel.com](https://vercel.com/)).
3. A **Render Account** ([render.com](https://render.com/)) or Railway Account ([railway.app](https://railway.app/)).
4. A **Neon PostgreSQL Database** ([neon.tech](https://neon.tech/)).
5. A **Clerk Account** ([clerk.com](https://clerk.com/)).

---

## ⚙️ Step 1: Provision the Database (Neon PostgreSQL)

1. Go to [Neon.tech](https://neon.tech/) and create a new project (e.g. `paperbuddy-db`).
2. Copy your connection strings from the Neon Dashboard:
   - **Pooled connection string** (PgBouncer enabled):
     ```env
     DATABASE_URL="postgresql://user:password@ep-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
     ```
   - **Direct connection string** (Direct connection for Prisma migrations):
     ```env
     DIRECT_URL="postgresql://user:password@ep-direct.us-east-2.aws.neon.tech/neondb?sslmode=require"
     ```
3. Run migrations and seed data locally against your cloud Neon database:
   ```bash
   # Push schema to Neon PostgreSQL
   npx prisma db push

   # (Optional) Seed initial demo data (students, fee structures, transactions)
   npm run seed
   ```

---

## 🖥️ Step 2: Deploy the Backend (Express + Socket.IO) on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository `PaperBuddyFintech`.
3. Configure the Web Service settings:
   - **Name**: `paperbuddy-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (e.g., Oregon / Frankfurt / Singapore)
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free` (or `Starter` for no cold-starts)

4. Add **Environment Variables** in the Render Dashboard:

| Key | Value / Example | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `3001` | Render injects this automatically |
| `DATABASE_URL` | `postgresql://user:pass@ep-pooler.neon.tech/neondb?sslmode=require` | Neon Pooled URL |
| `DIRECT_URL` | `postgresql://user:pass@ep-direct.neon.tech/neondb?sslmode=require` | Neon Direct URL |
| `CLERK_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Clerk Secret Key |

5. Click **Create Web Service**. Wait for the deployment to finish and copy your live backend URL:  
   👉 `https://paperbuddy-backend.onrender.com`

---

## 🎨 Step 3: Deploy the Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository `PaperBuddyFintech`.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add **Environment Variables** in Vercel:

| Key | Value / Example | Notes |
| :--- | :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | Clerk Public Key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | Compatibility key |

5. Configure Routing & Rewrites (`vercel.json`):  
   The project includes a `vercel.json` in the root directory to handle single-page application routing and optionally proxy backend requests:

   ```json
   {
     "version": 2,
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://paperbuddy-backend.onrender.com/api/:path*"
       },
       {
         "source": "/socket.io/:path*",
         "destination": "https://paperbuddy-backend.onrender.com/socket.io/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *(Replace `https://paperbuddy-backend.onrender.com` with your actual Render service URL).*

6. Click **Deploy**. Vercel will build the frontend and provide your live application URL:  
   👉 `https://paperbuddy-fintech.vercel.app`

---

## 🔐 Step 4: Configure Clerk Authentication for Production

1. Log into your [Clerk Dashboard](https://dashboard.clerk.com/).
2. Select your application and go to **Paths / Domains / API Keys**.
3. Add your Vercel frontend URL to **Allowed Origins** and **Redirect URLs**:
   - `https://paperbuddy-fintech.vercel.app`
4. Copy production keys (`pk_live_...` and `sk_live_...`) into your Vercel and Render environment variables.

---

## ✅ Step 5: Post-Deployment Verification Checklist

After deployment, perform these verification tests:

- [ ] **Frontend Route Check**: Navigate to `https://paperbuddy-fintech.vercel.app/` and test login redirect.
- [ ] **Admin Portal**: Verify navigation across Overview, Defaulters, Reconciliation, and Fee Structures.
- [ ] **Parent Portal**: Log in as a parent and view student fee ledgers.
- [ ] **Real-Time WebSockets**: Open the Admin portal in one browser tab and Parent portal in another tab. Pay a fee and verify real-time Socket.IO update notifications trigger instantaneously without page refresh.
- [ ] **Database Persistence**: Create a test fee structure or record a transaction and refresh the page to confirm database persistence in Neon PostgreSQL.
- [ ] **Automated Cron Job**: Verify server logs on Render to ensure `node-cron` schedules are logging periodic reconciliation tasks.

---

## 🛠️ Summary of Deployment URLs

- **Frontend Application (Vercel)**: `https://<your-app-name>.vercel.app`
- **Backend API & WebSockets (Render)**: `https://<your-backend-service>.onrender.com`
- **Database Connection (Neon)**: `postgresql://...neon.tech/neondb`
