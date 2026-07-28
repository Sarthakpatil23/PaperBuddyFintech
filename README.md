# 💳 PaperBuddy Fintech — Comprehensive School Fee Management & Bank Reconciliation Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-black.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.1-646CFF.svg)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.22-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1.svg)](https://neon.tech/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-010101.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **PaperBuddy Fintech** is a production-ready, full-stack financial management platform designed specifically for educational institutions. It digitizes the entire school fee lifecycle — transforming fragmented spreadsheets, offline cash counters, and manual cheque tracking into a unified, audit-grade single source of truth with automated late fee calculation, real-time bank reconciliation, and live parent alerts.

---

## 📋 Table of Contents

- [1. Executive Summary & Problem Context](#1-executive-summary--problem-context)
- [2. Key Features & Capabilities](#2-key-features--capabilities)
- [3. Technology Stack & Architectural Rationales](#3-technology-stack--architectural-rationales)
- [4. Database Design & Relational Schema](#4-database-design--relational-schema)
- [5. System Architecture & Workflows](#5-system-architecture--workflows)
- [6. API Endpoint Reference](#6-api-endpoint-reference)
- [7. Repository Structure](#7-repository-structure)
- [8. Getting Started & Local Development](#8-getting-started--local-development)
- [9. Database Migrations & Seeding](#9-database-migrations--seeding)
- [10. Deployment Guide](#10-deployment-guide)
- [11. License & Contribution](#11-license--contribution)

---

## 1. Executive Summary & Problem Context

### The Challenge in School Finance
School fee management is traditionally fragmented, manual, and error-prone. Administrators rely on a patchwork of disconnected physical ledgers, Excel spreadsheets, and basic payment receipts. Key operational friction points include:

1. **Unreconciled Offline Payments**: Schools process large volumes of cash counter payments and post-dated cheques. Reconciling staff records against bank statements often takes days or weeks.
2. **Delayed Late Fee & Penalty Tracking**: Tracking who owes what after due dates requires manual calculations, resulting in lost revenue or inconsistent enforcement.
3. **Lack of Real-Time Visibility**: Admins lack a single dashboard view of daily revenue, active defaulters, collection efficiency, and pending bank deposits.
4. **Poor Communication with Parents**: Parents face ambiguity around outstanding dues, payment history, and fee breakdown, leading to unnecessary counter inquiries.

### The PaperBuddy Solution
PaperBuddy Fintech treats online payments (zero-fee UPI/NetBanking) and offline payments (Cash/Cheque) as **first-class equals** within a unified double-entry ledger framework:
- **Dynamic Fee Engine**: Custom fee categories, recurring intervals, grade-specific assignments, and auditable waivers.
- **Automated Late Fee Engine**: Daily cron jobs evaluate overdue accounts and enforce penalty rules without manual intervention.
- **Reconciliation Workspace**: 3-stage offline payment verification (`Pending` $\rightarrow$ `Reconciled` or `Flagged`), with automatic reopening of balances upon cheque bounce.
- **Real-Time Synchronized Dashboard**: Socket.IO WebSockets stream instant updates across administrative desks and parent portals.

---

## 2. Key Features & Capabilities

| Module | Features & Technical Highlights |
| :--- | :--- |
| 📊 **Admin Dashboard** | Real-time KPI stat cards (Total Revenue, Outstanding Dues, Active Defaulters, Collection Efficiency %), interactive revenue distribution charts, and date-range filtering. |
| 💸 **Dynamic Fee Engine** | Define custom fee types (Tuition, Transport, Exam, Library, Custom), set target scopes (Whole School, Specific Grade, Individual Student), and configure recurring cycles. |
| ⏱️ **Automated Penalty Engine** | Configurable late-fee rules (`PenaltyRule`) applied automatically by a daily `node-cron` scheduler. Enforces single-application constraints via `AppliedPenalty`. |
| 🏦 **Bank Reconciliation Workspace** | Dedicated workspace to match Cash/Cheque payments recorded by counter staff with actual bank statements. Includes discrepancy flagging and resolution workflows. |
| 🎯 **Defaulter Tracking** | Priority view listing overdue accounts categorized by severity (Mild 1–15d, Moderate 16–30d, Severe 30d+). One-click reminders, bulk penalty applications, and tap-to-call. |
| 📜 **Student Ledger & History** | Complete chronological financial history for every student, showing total billed items, payments, applied waivers, and real-time net outstanding balance. |
| 🔄 **Omnichannel Payment Engine** | Log UPI, Cash, Cheque, or Bank Transfers with instant receipt generation, refund processing (`REFUNDED` status), and balance adjustment. |
| 🤖 **Parent Portal & AI Assistant** | Dedicated parent view for multi-student fee tracking, immediate digital receipt downloads, and an integrated AI Chatbot for conversational fee inquiries. |
| ⚡ **Real-Time WebSockets** | Instant event broadcasts (`transaction_created`, `reconciliation_updated`, `penalty_applied`, `notification_received`) across connected clients. |
| 🔒 **Audit & Compliance** | Immutable system audit log (`AuditLog`), anomaly detection, soft-delete archiving for student records, and strict foreign key delete protections (`onDelete: Restrict`). |

---

## 3. Technology Stack & Architectural Rationales

### 🖥️ Frontend Architecture

| Technology | Purpose | Why It Was Chosen |
| :--- | :--- | :--- |
| **React 18** | UI Library | Component-driven model allows modular building of complex dashboard widgets, tables, and modal dialogs with high state reusability. |
| **Vite 5** | Build Tool & Dev Server | Ultra-fast Lightning HMR (Hot Module Replacement) and optimized production bundling compared to traditional Webpack setups. |
| **Tailwind CSS** | Styling Framework | Utility-first CSS provides a highly responsive, custom design system ("Indigo Harbor" theme) with sleek glassmorphism and modern UI components. |
| **Framer Motion** | Micro-Animations | Delivers fluid layout transitions, modal animations, and dynamic state feedback to elevate user engagement. |
| **Socket.IO Client** | Real-Time Sync | Maintains a persistent WebSocket connection to receive real-time dashboard and notification updates from the Express backend. |
| **Lucide React** | Iconography | Lightweight, accessible, and customizable SVG icons tailored for financial and dashboard interfaces. |

---

### ⚙️ Backend Architecture

| Technology | Purpose | Why It Was Chosen |
| :--- | :--- | :--- |
| **Node.js (v18+)** | Runtime Environment | Non-blocking, asynchronous event loop allows high-throughput processing of concurrent API requests and WebSocket events. |
| **Express (v5.2)** | Web Framework | Lightweight, robust routing framework for building clean RESTful API endpoints with flexible middleware integration. |
| **Prisma ORM (v5.22)** | Database Client | Provides end-to-end type safety, auto-generated queries, declarative schema management, and version-controlled database migrations. |
| **Socket.IO Server** | WebSocket Engine | Handles bi-directional, event-based real-time communication between server, admin dashboards, and parent portals. |
| **Node-Cron (v4.6)** | Job Scheduler | Reliable background task runner used for daily automated late fee evaluations and due-date status updates. |
| **Clerk Auth** | Authentication | Enterprise-grade multi-role authentication framework (Admin, Staff, Parent) with role-based access control and session management. |

---

### 🗄️ Database Architecture

| Technology | Purpose | Why It Was Chosen |
| :--- | :--- | :--- |
| **Neon PostgreSQL** | Primary Database | Cloud-native, serverless PostgreSQL offering instant branching, auto-scaling compute, and high availability. |
| **PgBouncer Connection Pooling** | Traffic Optimization | Uses pooled database connection strings (`DATABASE_URL`) for runtime application queries to prevent connection exhaustion during traffic spikes. |
| **Direct Migration URL** | DDL Schema Engine | Direct non-pooled TCP connection (`DIRECT_URL`) dedicated to executing schema migrations without PgBouncer transactional limits. |

---

## 4. Database Design & Relational Schema

### 4.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o| Parent : "associates account"
    Parent ||--o{ ParentStudent : "links to"
    Student ||--o{ ParentStudent : "belongs to"
    Student ||--o{ FeeAssignment : "assigned"
    FeeType ||--o{ FeeAssignment : "defines category"
    FeeType ||--o{ PenaltyRule : "configures rule"
    PenaltyRule ||--o{ AppliedPenalty : "tracks execution"
    FeeAssignment ||--o{ AppliedPenalty : "incurs penalty"
    FeeAssignment ||--o{ Installment : "divided into"
    Student ||--o{ Transaction : "executes"
    FeeAssignment ||--o| Transaction : "settles balance"
    Student ||--o{ Waiver : "granted"
    FeeAssignment ||--o| Waiver : "reduces balance"
    Transaction ||--o{ ReconciliationEntry : "reconciles"
    Parent ||--o{ Notification : "receives"
```

---

### 4.2 Core Data Models & Fields

#### `Student` Model
Acts as the anchor for all academic and financial ledger activities.
- `id` (`String`, PK, `cuid()`): Internal unique identifier.
- `studentId` (`String`, Unique, Indexed): Public student ID (e.g., `STU-2026-001`).
- `name` (`String`), `grade` (`String`, Indexed), `section` (`String?`), `rollNo` (`String?`).
- `isActive` (`Boolean`, Default `true`, Indexed): Flag used for soft-delete archiving.
- `archivedAt` (`DateTime?`): Timestamp when student was archived.
- **Relations**: Restrictive deletes (`onDelete: Restrict`) on `feeAssignments`, `transactions`, and `waivers` protect historical audit integrity.

#### `FeeType` & `FeeAssignment` Models
Defines fee catalog items and tracks individual student obligations.
- **`FeeType`**: `name`, `category` (`TUITION`, `TRANSPORT`, `LATE_FEE`, `EXAM`, `LIBRARY`, `CUSTOM`), `amount`, `recurrence` (`ONE_TIME`, `MONTHLY`, `QUARTERLY`, `ANNUALLY`), `targetScope` (`ALL`, `GRADE`, `STUDENT`).
- **`FeeAssignment`**: Links `Student` and `FeeType`. Stores `originalAmount`, `adjustedAmount`, `dueDate` (Indexed), and `status` (`PENDING`, `PAID`, `PARTIAL`, `OVERDUE`, `WAIVED`).

#### `PenaltyRule` & `AppliedPenalty` Models
Automated engine for late fee calculation.
- **`PenaltyRule`**: `feeTypeId`, `triggerDaysAfterDue` (`Int`), `penaltyAmount` (`Decimal?`), `penaltyPercent` (`Decimal?`), `autoApply` (`Boolean`).
- **`AppliedPenalty`**: Junction record tracking executed penalties. Enforces `@@unique([feeAssignmentId, penaltyRuleId])` to strictly block duplicate applications.

#### `Transaction` Model
Omnichannel ledger record for all incoming/outgoing funds.
- `txnNumber` (`String`, Unique, Indexed): Unique system reference code.
- `receiptNo` (`String`, Unique): Official serial receipt number.
- `studentId` (`String`, FK $\rightarrow$ `Student.id`, `onDelete: Restrict`, Indexed).
- `feeAssignmentId` (`String?`, FK $\rightarrow$ `FeeAssignment.id`, `onDelete: SetNull`, Indexed).
- `amount` (`Decimal`), `method` (`UPI`, `ONLINE`, `CASH`, `CHEQUE`, `BANK_TRANSFER`), `status` (`PENDING`, `SUCCESS`, `FAILED`, `BOUNCED`, `RECONCILED`, `REFUNDED`, Indexed).
- `chequeNumber`, `bankReference`, `collectedBy`, `remarks`.
- **Refund Tracking**: `refundedAmount`, `refundReason`, `refundedAt`, `refundedBy`.

#### `ReconciliationEntry` Model
Offline verification workflow workspace.
- `transactionId` (`String`, FK $\rightarrow$ `Transaction.id`, `onDelete: Cascade`, Indexed).
- `status` (`ReconciliationStatus`: `PENDING`, `RECONCILED`, `FLAGGED`, Indexed).
- `chequeDetails`, `notes`, `reconciledBy`, `reconciledAt`.

---

### 4.3 Database Enforcements & Architectural Safety

1. **Financial History Protection (`onDelete: Restrict`)**:
   Deleting a student with linked payment transactions, fee assignments, or waivers is strictly blocked at the database level by PostgreSQL foreign key constraints.
2. **Soft-Delete Archiving**:
   Inactive or graduated students are archived using `isActive: false` and `archivedAt: timestamp`, preserving audit history while excluding them from active queries.
3. **Explicit Foreign Key Indexing**:
   Every foreign key column (`studentId`, `feeTypeId`, `feeAssignmentId`, `userId`, `parentId`, `transactionId`) is explicitly indexed, guaranteeing high-performance query execution confirmed via `EXPLAIN ANALYZE`.
4. **Dual Connection Strategy**:
   - `DATABASE_URL`: Application runtime queries connect through Neon's PgBouncer pooler (`-pooler` endpoint).
   - `DIRECT_URL`: Database migrations execute through Neon's direct TCP connection to bypass PgBouncer DDL limitations.

---

## 5. System Architecture & Workflows

### 5.1 End-to-End Payment & Real-Time Sync Flow

```mermaid
sequenceDiagram
    autonumber
    actor Parent/Staff
    participant Client as React App (Vite)
    participant Server as Express Server
    participant Socket as Socket.IO Hub
    participant DB as Neon PostgreSQL (Prisma)

    Parent/Staff->>Client: Submit Payment (UPI/Cash/Cheque)
    Client->>Server: POST /api/transactions
    Server->>DB: Execute Transaction & Update FeeAssignment Balance
    DB-->>Server: Transaction Record Created & Fee Status Updated
    Server->>DB: Log Audit Event (AuditLog)
    Server->>Socket: Emit Broadcast ("transaction_created", payload)
    Socket-->>Client: Real-Time UI Refresh (Admin Dashboard & Ledger)
    Server-->>Client: HTTP 201 Response + Receipt PDF Data
```

---

### 5.2 Bank Reconciliation Workflow

```mermaid
flowchart TD
    A[Staff Records Cash/Cheque Payment] --> B[Transaction Created: Status SUCCESS / Reconciliation PENDING]
    B --> C[Entry Created in Reconciliation Workspace]
    C --> D{Admin Audit Choice}
    D -- Bank Statement Matches --> E[Click 'Mark Reconciled']
    E --> F[Status set to RECONCILED in Transaction & Entry]
    D -- Mismatch / Bounced Cheque --> G[Click 'Flag Discrepancy']
    G --> H[Entry Status set to FLAGGED]
    H --> I{Resolution Action}
    I -- Resolve Mismatch --> J[Adjust Amount & Log Audit Reason]
    I -- Cheque Bounced --> K[Set Txn Status to BOUNCED & Automatically Re-open Student Fee Balance]
```

---

### 5.3 Automated Late Fee Calculation (Cron Engine)

```mermaid
flowchart LR
    A[Daily Cron Job Triggers @ Midnight] --> B[Query Overdue FeeAssignments]
    B --> C[Fetch Active PenaltyRules for FeeType]
    C --> D{Check AppliedPenalty Junction}
    D -- Already Applied --> E[Skip Assignment]
    D -- Not Applied & Days Overdue Met --> F[Calculate Fixed or % Penalty]
    F --> G[Update FeeAssignment Adjusted Amount]
    G --> H[Create AppliedPenalty Record]
    H --> I[Emit Socket Event & Send Parent Notification]
```

---

## 6. API Endpoint Reference

### 👤 Authentication & Dashboard Overview
- `GET /api/stats` — Retrieve top-level summary metrics (Revenue, Defaulters, Efficiency, Dues).
- `GET /api/charts/revenue` — Fetch revenue breakdown by fee type and payment method.

### 🎓 Student Management
- `GET /api/students` — List active students with pagination, search, and grade filters.
- `GET /api/students/:id/ledger` — Fetch complete financial history & balance for a student.
- `POST /api/students/:id/archive` — Soft-delete archive a student (`isActive: false`).

### 💸 Fee Structure & Penalties
- `GET /api/fee-types` — Fetch all configured fee types.
- `POST /api/fee-types` — Create a new fee type & target assignment scope.
- `GET /api/penalty-rules` — List automated late fee penalty rules.
- `POST /api/penalty-rules` — Create a penalty rule for a specific fee type.

### 💳 Transactions & Refunds
- `GET /api/transactions` — Search, filter, and paginate complete transaction log.
- `POST /api/transactions` — Record an online or offline payment transaction.
- `POST /api/transactions/:id/refund` — Issue a refund, log reason, and reopen fee balance.
- `GET /api/transactions/export` — Download filtered transaction log as CSV/PDF.

### 🏦 Reconciliation Workspace
- `GET /api/reconciliation/pending` — List pending offline entries awaiting bank match.
- `GET /api/reconciliation/flagged` — List flagged discrepancies requiring resolution.
- `POST /api/reconciliation/:id/reconcile` — Confirm bank reconciliation for an entry.
- `POST /api/reconciliation/bulk-reconcile` — Bulk reconcile multiple entries.
- `POST /api/reconciliation/:id/flag` — Flag entry with reason (mismatch/bounced).
- `POST /api/reconciliation/:id/resolve` — Resolve a flagged entry with audit trail.

---

## 7. Repository Structure

```
PaperBuddyFintech/
├── .env.example                # Template for environment configuration
├── INFO.md                     # Detailed project domain & business requirements
├── README.md                   # Complete system documentation (this file)
├── admin-dashboard.md          # Functional spec for admin dashboard modules
├── database.md                 # Technical reference for DB migrations & pooling
├── deployment guide.md         # Full deployment guide for Vercel, Render & Neon
├── transactions-reconciliation.md # Specification for transactions & bank reconciliation
├── package.json                # Project dependencies & npm scripts
├── prisma/
│   ├── schema.prisma           # Prisma relational schema definition
│   ├── seed.js                 # Automated seed script with realistic data
│   └── migrations/             # Version-controlled database migrations
├── server/
│   ├── index.js                # Express REST API, Socket.IO & Cron scheduler
│   └── chatbot/                # AI Fee Concierge server module
└── src/
    ├── App.jsx                 # Main application layout & role provider
    ├── main.jsx                # Application entry point
    ├── index.css               # Global CSS & Tailwind design tokens
    ├── components/             # Reusable UI components
    │   ├── AppLayout.jsx       # Responsive navigation sidebar & header
    │   ├── DefaulterTracking.jsx # Priority defaulter management
    │   ├── FeeStructureManager.jsx # Fee catalog & rule configuration
    │   ├── LoginPage.jsx       # Role preset simulation & authentication
    │   ├── OverviewCards.jsx   # Top-level summary stat card grid
    │   ├── QuickActionsModal.jsx # Contextual action triggers
    │   ├── ReconciliationWorkspace.jsx # Bank reconciliation desk
    │   ├── RevenueCharts.jsx   # Interactive financial visualizers
    │   ├── StudentLedgerView.jsx # Individual student balance timeline
    │   └── TransactionsLog.jsx # Searchable omnichannel transaction table
    └── pages/                  # Top-level application pages
        ├── OverviewPage.jsx    # Dashboard home view
        ├── TransactionsPage.jsx# Full transaction log view
        ├── ReconciliationPage.jsx # Reconciliation workspace view
        ├── FeeStructuresPage.jsx # Fee configuration page
        ├── DefaultersPage.jsx  # Defaulter tracking page
        └── StudentLedgerPage.jsx # Student lookup & ledger page
```

---

## 8. Getting Started & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: Neon serverless database instance or local PostgreSQL server

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sarthakpatil23/PaperBuddyFintech.git
cd PaperBuddyFintech
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your connection strings:
```bash
cp .env.example .env
```

Set the following variables in `.env`:
```env
# Database Connection Strings (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-direct.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Server Port
PORT=3001

# Clerk Authentication (Optional)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## 9. Database Migrations & Seeding

### 1. Apply Schema Migrations
Deploy the database migrations to set up tables, indexes, and constraints:
```bash
npx prisma migrate dev
```

*(For production environments, use `npx prisma migrate deploy`)*

### 2. Seed Initial Test Data
Populate the database with test records (Students, Fee Assignments, Transactions, Reconciliation Entries, Penalty Rules):
```bash
npm run seed
```

### 3. Launch Development Servers

Run the backend server (Node.js/Express on Port `3001`):
```bash
npm run server
```

In a separate terminal, launch the frontend dev server (Vite on Port `5173`):
```bash
npm run dev
```

Access the application in your browser at `http://localhost:5173`.

---

## 10. Deployment Guide

PaperBuddy Fintech is optimized for cloud deployment using serverless and modern cloud platforms:

| Component | Platform | Deployment Instructions |
| :--- | :--- | :--- |
| **Frontend (React SPA)** | **Vercel** | Connect repository, set build command `npm run build`, output directory `dist`, add rewrite rule in `vercel.json` for SPA routing. |
| **Backend (Express + Socket.IO)** | **Render / Railway** | Deploy as Web Service, set start command `npm run start`, add environment variables (`DATABASE_URL`, `PORT=3001`, `CORS_ORIGIN`). |
| **Database (PostgreSQL)** | **Neon Serverless** | Provision serverless PostgreSQL, obtain pooled connection (`DATABASE_URL`) and direct connection (`DIRECT_URL`). |

For step-by-step deployment configurations, refer to the **[Deployment Guide](deployment%20guide.md)**.

---

## 11. License & Contribution

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

Developed with ❤️ for educational institutions seeking transparent, automated, and audit-ready fee management.