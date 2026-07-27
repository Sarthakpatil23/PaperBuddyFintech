# PaperBuddy Fintech — Database System, Migrations & Architecture Documentation

This document provides a comprehensive, exhaustive reference for the database design, relational schema, migration history, connection pooling, and runtime workflows implemented in **PaperBuddy Fintech School Fee Management System**.

---

## 1. Executive Summary & Architecture Overview

PaperBuddy Fintech uses a serverless **Neon (PostgreSQL)** database powered by **Prisma ORM (v5.22.0)** and versioned schema migrations (`prisma migrate`). The database serves as the single source of truth for all student enrollment records, fee assignments, automated penalty rules, omnichannel payment transactions, waivers, bank reconciliations, audit logs, and notifications.

### Key Architectural & Safety Enforcements
1. **Financial History Protection (Restrict Deletes)**: All foreign key relations from `Transaction`, `FeeAssignment`, and `Waiver` back to `Student` enforce `onDelete: Restrict`. Students with any financial history can never be hard-deleted.
2. **Soft-Delete Archiving**: Inactive students are preserved in the database with `isActive: false` and timestamped `archivedAt`, accessible via filter toggles in student queries and UI components.
3. **Automated Penalty Engine (`PenaltyRule` & `AppliedPenalty`)**: Configurable penalty rules trigger automated late fees via a daily scheduled `node-cron` job. Multi-application prevention is enforced by a unique junction constraint on `AppliedPenalty(feeAssignmentId, penaltyRuleId)`.
4. **Refund Workflow (`REFUNDED`)**: Refunded transactions maintain full auditability with `refundedAmount`, `refundReason`, `refundedAt`, and `refundedBy` fields, automatically re-opening linked fee assignment balances.
5. **Versioned Migrations History**: Migrations are strictly version-controlled under `prisma/migrations/`. Schema changes use `prisma migrate dev` locally and `prisma migrate deploy` in production environments.
6. **Dual Connection Pooling Strategy**:
   - `DATABASE_URL`: Pooled connection string (`-pooler` PgBouncer host) used for application query traffic.
   - `DIRECT_URL`: Direct non-pooled connection string used exclusively for running DDL schema migrations.
7. **Explicit Foreign Key Indexing**: Every single foreign key column across all tables (`studentId`, `parentId`, `feeTypeId`, `transactionId`, `feeAssignmentId`, `userId`, `autoApply`, etc.) is explicitly indexed, verified via `EXPLAIN ANALYZE`.

---

## 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o| Parent : "has account"
    Parent ||--o{ ParentStudent : "links to"
    Student ||--o{ ParentStudent : "linked with"
    Student ||--o{ FeeAssignment : "assigned"
    FeeType ||--o{ FeeAssignment : "defines"
    FeeType ||--o{ PenaltyRule : "configures"
    PenaltyRule ||--o{ AppliedPenalty : "tracks"
    FeeAssignment ||--o{ AppliedPenalty : "incurs"
    FeeAssignment ||--o{ Installment : "broken into"
    Student ||--o{ Transaction : "pays"
    FeeAssignment ||--o| Transaction : "settles"
    Student ||--o{ Waiver : "receives"
    FeeAssignment ||--o| Waiver : "adjusts"
    Transaction ||--o{ ReconciliationEntry : "reconciles"
    Parent ||--o{ Notification : "notified"
```

---

## 3. Versioned Migration History Log

| Migration Name | Description | Key Changes |
| :--- | :--- | :--- |
| `20260727000000_00_init_baseline` | Baseline Schema | Created initial `User`, `Parent`, `Student`, `ParentStudent`, `FeeType`, `FeeAssignment`, `Transaction`, `Waiver`, `ReconciliationEntry`, `AuditLog`, `Notification` tables. |
| `20260727010000_01_prevent_cascade_and_add_soft_delete` | Fix 1: Restrict Deletes & Soft-Delete | Changed `Student` relations in `FeeAssignment`, `Transaction`, and `Waiver` to `onDelete: Restrict`. Added `isActive` and `archivedAt` to `Student`. |
| `20260727020000_02_add_penalty_rule_engine` | Fix 2: Penalty Engine | Created `PenaltyRule` and `AppliedPenalty` models for daily automated late fee processing. |
| `20260727030000_03_add_refund_fields_and_status` | Fix 3: Refund Engine | Added `REFUNDED` to `PaymentStatus` enum and added `refundedAmount`, `refundReason`, `refundedAt`, `refundedBy` columns to `Transaction`. |
| `20260727040000_04_add_missing_fk_indexes` | Fix 5: Explicit FK Indexes | Added explicit indexes on `Parent(userId)`, `FeeAssignment(feeTypeId)`, `Transaction(feeAssignmentId)`, and `Waiver(feeAssignmentId)`. |

---

## 4. Connection Pooling Configuration (Fix 7)

```env
# DATABASE_URL: Pooled connection string (PgBouncer -pooler host)
DATABASE_URL="postgresql://neondb_owner:npg_EUzjVOQJF7S1@ep-silent-bird-aygpv521-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# DIRECT_URL: Direct non-pooled connection string for migrations
DIRECT_URL="postgresql://neondb_owner:npg_EUzjVOQJF7S1@ep-silent-bird-aygpv521.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

In `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## 5. Detailed Data Model & Index Specification

### 5.1. `Student` Model
- `id`: `String` (cuid, PK)
- `studentId`: `String` (Unique, indexed)
- `name`: `String`
- `grade`: `String` (Indexed)
- `section`: `String?`
- `rollNo`: `String?`
- `isActive`: `Boolean` (Default: `true`, Indexed) — Used for soft-delete filtering.
- `archivedAt`: `DateTime?` — Timestamp of archive operation.
- **Relations**:
  - `feeAssignments`: `FeeAssignment[]` (`onDelete: Restrict`)
  - `transactions`: `Transaction[]` (`onDelete: Restrict`)
  - `waivers`: `Waiver[]` (`onDelete: Restrict`)

### 5.2. `PenaltyRule` Model
- `id`: `String` (cuid, PK)
- `feeTypeId`: `String` (FK -> `FeeType.id`, `onDelete: Cascade`, Indexed)
- `triggerDaysAfterDue`: `Int`
- `penaltyAmount`: `Decimal(10,2)?`
- `penaltyPercent`: `Decimal(5,2)?`
- `autoApply`: `Boolean` (Default: `false`, Indexed)
- **Application Validation**: Exactly one of `penaltyAmount` or `penaltyPercent` must be set (enforced at API level).

### 5.3. `AppliedPenalty` Model
- `id`: `String` (cuid, PK)
- `feeAssignmentId`: `String` (FK -> `FeeAssignment.id`, `onDelete: Cascade`, Indexed)
- `penaltyRuleId`: `String` (FK -> `PenaltyRule.id`, `onDelete: Cascade`, Indexed)
- `appliedAt`: `DateTime` (Default: `now()`)
- **Constraint**: `@@unique([feeAssignmentId, penaltyRuleId])`

### 5.4. `Transaction` Model
- `id`: `String` (cuid, PK)
- `txnNumber`: `String` (Unique, default uuid, indexed)
- `receiptNo`: `String` (Unique)
- `studentId`: `String` (FK -> `Student.id`, `onDelete: Restrict`, Indexed)
- `feeAssignmentId`: `String?` (FK -> `FeeAssignment.id`, `onDelete: SetNull`, Indexed)
- `amount`: `Decimal(10,2)`
- `method`: `PaymentMethod`
- `status`: `PaymentStatus` (Indexed) — Includes `REFUNDED`
- `refundedAmount`: `Decimal(10,2)?`
- `refundReason`: `String?`
- `refundedAt`: `DateTime?`
- `refundedBy`: `String?`

---

## 6. Authentication Inspection Findings (Fix 4)

- **Auth Strategy**: Authentication in the frontend (`src/components/LoginPage.jsx`) currently uses role preset simulation (`admin`, `cashier`, `parent`). `@clerk/clerk-react` is present in `package.json` and `.env`, but is not yet initialized in `src/main.jsx` or `src/App.jsx`.
- **Session/Token Storage**: Session state is managed in React component state (`authUser`) and `localStorage` for UI theme. No JWT signing or cookie tokens exist on the Express server.
- **Password Hashing**: Currently bypassed; form accepts dummy password inputs without server-side bcrypt or argon2 hashing.
- **Brute-Force Protection**: Login endpoints currently lack rate-limiting middleware (`express-rate-limit`).

---

## 7. Verification Checklist

- [x] **Restrict Deletes**: Hard-deleting a student with financial history is blocked by PostgreSQL FK constraints (`onDelete: Restrict`). Soft delete via `POST /api/students/:id/archive` preserves financial integrity.
- [x] **Penalty Engine**: `PenaltyRule` and `AppliedPenalty` tables created. `node-cron` job runs daily, enforcing single penalty application per rule + assignment pair.
- [x] **Refund Support**: `REFUNDED` status added to `PaymentStatus` enum. `POST /api/transactions/:id/refund` records refund fields, re-opens linked fee assignment balance, and logs audit events.
- [x] **Auth Strategy Inspected**: Findings documented in Fix 4 section.
- [x] **Foreign Key Indexes**: Every foreign key column (`studentId`, `feeTypeId`, `feeAssignmentId`, `userId`, `transactionId`) explicitly indexed and verified via `EXPLAIN ANALYZE`.
- [x] **Versioned Migrations**: Transitioned from `db push` to `prisma migrate` with 5 deployment migrations under `prisma/migrations/`.
- [x] **Neon Connection Pooling**: `DATABASE_URL` (pooled `-pooler`) and `DIRECT_URL` (direct non-pooled) configured and tested.
