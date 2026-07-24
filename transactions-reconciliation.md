# Transactions Log & Reconciliation — Page Specification

This document specifies two pages that follow the existing dashboard (PaperBuddy Admin): **Transactions Log** and **Reconciliation**, both already present as sidebar nav items. It covers layout, data fields, filters, states, and actions in enough detail to build directly.

---

# PART 1: Transactions Log

## Purpose

A complete, searchable, exportable record of every fee transaction in the system — online (UPI) and offline (Cash/Cheque) — treated as equal first-class entries in the same table.

## Page Header

- Title: "Transactions Log"
- Subtitle: "Search, filter, and export every payment recorded in the system"
- Top-right actions:
  - **Export** button (dropdown: CSV / PDF, exports current filtered view, not just current page)
  - **Record Payment** button (opens the same modal used elsewhere in the dashboard for manually logging a cash/cheque/offline payment)

## Summary Strip (below header, above table)

Small inline stat row, not full stat cards — just numbers for context:

- Total transactions (in current filter/date range)
- Total amount (in current filter/date range)
- Paid / Pending / Failed / Bounced counts (small colored badges)

## Filters & Search Bar

- **Search box**: search by student name, student ID, or transaction ID
- **Date range picker**: with quick presets (Today, This Week, This Month, This Year, Custom Range)
- **Fee type filter**: multi-select dropdown (Tuition, Transport, Late Fee, custom types — pulled dynamically from Fee Structures)
- **Payment method filter**: multi-select (UPI, Cash, Cheque)
- **Status filter**: multi-select (Paid, Pending, Failed, Bounced, Refunded)
- **Class/Grade filter**: dropdown
- All filters combine with AND logic; filter state should persist in the URL query string so a filtered view can be shared/bookmarked/refreshed without resetting.
- **Clear all filters** link, shown only when at least one filter is active.

## Table Columns

| Column         | Details                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------- |
| Checkbox       | for bulk actions (e.g., bulk export selected, bulk mark for reconciliation)                  |
| Date & Time    | sortable, format:`24 Jul 2026, 10:42 AM`                                                   |
| Student        | name + class/section, clickable → jumps to Student Ledger                                   |
| Transaction ID | short unique reference, copyable on click                                                    |
| Fee Type       | badge-style tag(s); a transaction can cover multiple fee line items                          |
| Amount         | right-aligned, ₹ formatted, bold                                                            |
| Method         | icon + label (UPI / Cash / Cheque)                                                           |
| Status         | colored badge: green=Paid, amber=Pending, red=Failed, rose=Bounced, gray=Refunded            |
| Processed By   | staff name for offline entries; "System" for online/UPI                                      |
| Reconciliation | badge: Reconciled / Unreconciled / N/A (N/A for UPI, since it's auto-reconciled via webhook) |
| Actions        | "View" icon (opens drill-down)                                                               |

## Sorting

- Default sort: Date & Time, descending (most recent first)
- Sortable columns: Date, Amount, Student Name

## Pagination

- Server-side pagination (do not load all transactions client-side — this table can grow large)
- Page size selector: 25 / 50 / 100 rows
- Show total count: "Showing 1–50 of 1,284 transactions"

## Row Drill-Down (Modal or Side Panel)

Clicking a row (or the "View" action) opens full detail:

- Full transaction ID, timestamp, student info
- Itemized breakdown if the transaction covers multiple fee components
- Payment method details:
  - UPI: UTR/reference number, payer VPA (if available), gateway name
  - Cash: receipt number, collected by, location/counter
  - Cheque: cheque number, bank name, deposit date, clearing status
- Status history timeline (e.g., Pending → Paid, or Paid → Bounced → Re-opened)
- Linked receipt (view/download PDF)
- Reconciliation status + link to Reconciliation page entry if unreconciled
- "Refund" action (if status is Paid and refund is applicable) — should require confirmation and a reason field

## Empty States

- No transactions match filters: friendly empty state with "Clear filters" CTA
- No transactions at all (new system): onboarding-style empty state prompting "Record your first payment"

## Loading & Error States

- Skeleton rows while loading (not a spinner blocking the whole page)
- If fetch fails: inline error banner with "Retry" button, table area shows a fallback message rather than a blank screen

## Bulk Actions (via checkbox selection)

- Export selected rows
- Bulk mark as reconciled (only enabled if all selected rows are Cash/Cheque and status is Paid)
- Bulk send receipt (email to parent) for selected rows

## Real-Time Behavior

- New transactions (especially UPI, via webhook) should appear at the top of the table automatically without a manual refresh, with a brief highlight animation on the new row
- Status changes (e.g., a pending UPI payment confirming, or a cheque bouncing) should update in place

---

# PART 2: Reconciliation

## Purpose

A dedicated workspace for matching offline payments (Cash/Cheque) recorded by staff against actual bank confirmation — closing the loop between "money recorded in the system" and "money confirmed in the bank."

## Page Header

- Title: "Reconciliation"
- Subtitle: "Match recorded cash & cheque entries against bank confirmation"
- Top-right actions:
  - **Bulk Reconcile** button (enabled only when rows are selected)
  - **Export Reconciliation Report** button

## Summary Strip

- **Total Unreconciled Amount** (large, prominent — this is the key number on this page)
- **Pending Reconciliation Count** (number of entries)
- **Flagged/Discrepant Count** (entries with a mismatch or bounced cheque)
- **Reconciled This Month** (amount + count, for context/progress)

Consider a small progress bar: reconciled vs. total offline transactions for the current period.

## Tabs (to organize the workspace)

- **Pending** (default view) — entries awaiting reconciliation
- **Flagged** — entries with discrepancies or bounced cheques, needs admin attention
- **Reconciled** — historical log of completed reconciliations (read-only, for audit)

## Filters

- Date range (entry date)
- Method: Cash / Cheque
- Amount range
- Recorded by (staff member dropdown)
- Class/Grade

## Table Columns — Pending Tab

| Column         | Details                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Checkbox       | for bulk reconcile                                                                                       |
| Entry Date     | when staff recorded the payment                                                                          |
| Student        | name + class, clickable                                                                                  |
| Amount         | ₹ formatted                                                                                             |
| Method         | Cash / Cheque badge                                                                                      |
| Cheque Details | (only shown/populated for cheque entries): cheque number, bank name, deposit date                        |
| Recorded By    | staff member name                                                                                        |
| Days Pending   | how long it's been awaiting reconciliation — highlight in amber/red if pending too long (e.g., >7 days) |
| Actions        | "Mark Reconciled" (single-click with confirmation) / "Flag Discrepancy"                                  |

## Table Columns — Flagged Tab

| Column            | Details                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Student           | name + class                                                                                                       |
| Amount (Recorded) | what was originally logged                                                                                         |
| Amount (Bank)     | what actually came in, if a mismatch — shown side-by-side with recorded amount, difference highlighted            |
| Flag Reason       | dropdown-selected reason: "Amount mismatch" / "Cheque bounced" / "Duplicate entry" / "Other" (with free-text note) |
| Flagged By        | staff/admin who flagged it                                                                                         |
| Flagged Date      |                                                                                                                    |
| Actions           | "Resolve" (opens resolution modal)                                                                                 |

### Resolution Modal (Flagged entries)

- Show original entry details + flag reason/note
- Resolution options:
  - **Confirm bank amount is correct** → adjusts the transaction record, logs adjustment in audit trail
  - **Mark as bounced cheque** → automatically re-opens the student's balance for that fee (critical business rule), transaction status changes to "Bounced," a new entry may be auto-created for the reopened balance
  - **Mark as resolved (data entry error, now corrected)** → requires a note explaining the correction
- All resolutions require a mandatory reason/note field for audit purposes

## Table Columns — Reconciled Tab (read-only history)

| Column          | Details                               |
| --------------- | ------------------------------------- |
| Student         |                                       |
| Amount          |                                       |
| Method          |                                       |
| Entry Date      | when recorded                         |
| Reconciled Date | when confirmed                        |
| Reconciled By   | admin who confirmed                   |
| Reference       | bank statement reference, if attached |

## Mark as Reconciled — Action Flow

1. Admin selects one or more Pending entries (checkbox)
2. Clicks "Mark Reconciled" (single row) or "Bulk Reconcile" (multiple)
3. Confirmation dialog: shows count + total amount being reconciled, optional field to attach a bank statement reference/batch number
4. On confirm: entries move from Pending → Reconciled tab, status updates in Transactions Log too (Reconciliation column changes from "Unreconciled" to "Reconciled")
5. Activity feed logs the action (who reconciled what, when)

## Flag Discrepancy — Action Flow

1. Admin selects a Pending entry, clicks "Flag Discrepancy"
2. Modal opens: select reason, optionally enter bank amount (if it's a mismatch), free-text note (required)
3. On submit: entry moves from Pending → Flagged tab
4. If reason = "Cheque bounced": system should prompt "This will re-open the student's balance — confirm?" before finalizing, since this has a direct financial consequence

## Empty States

- Pending tab empty: "All caught up! No entries awaiting reconciliation." (positive framing, since empty here is a good thing)
- Flagged tab empty: "No discrepancies flagged." (also positive)
- Reconciled tab empty (new system): standard empty state

## Real-Time Behavior

- New offline payments recorded elsewhere in the system (e.g., via "Record Payment" on the dashboard or Transactions Log) should appear in the Pending tab automatically
- Reconciled/Flagged counts in the summary strip should update live as actions are taken, without requiring a page refresh

## Cross-Page Consistency Rules

- Status colors must match those used elsewhere in the dashboard: green = reconciled/paid, amber = pending, red/rose = flagged/bounced/failed
- Any reconciliation action taken here must be reflected immediately in: the Transactions Log (Reconciliation column), the dashboard's Reconciliation Status chart, and the Audit & Activity feed
- A bounced cheque flagged and resolved here must automatically update the student's outstanding balance in the Student Ledger — this link should never be manual/disconnected

---

## API Endpoints Needed (Suggested)

**Transactions Log**

- `GET /api/transactions` — paginated, filterable, sortable list
- `GET /api/transactions/:id` — full detail for drill-down
- `POST /api/transactions/:id/refund`
- `GET /api/transactions/export` — respects current filters, returns CSV/PDF

**Reconciliation**

- `GET /api/reconciliation/pending`
- `GET /api/reconciliation/flagged`
- `GET /api/reconciliation/history`
- `POST /api/reconciliation/:id/reconcile`
- `POST /api/reconciliation/bulk-reconcile`
- `POST /api/reconciliation/:id/flag`
- `POST /api/reconciliation/:id/resolve`

All write endpoints (reconcile, flag, resolve, refund) must write an entry to the audit log table as part of the same database transaction — never as a separate, potentially-failing follow-up call.
