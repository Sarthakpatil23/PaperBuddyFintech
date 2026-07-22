
# Admin Dashboard — Requirements Specification

This document breaks down every section of the admin dashboard into concrete components, the data each component needs, and the interactions it must support. Use this as the functional spec when building the dashboard.

---

## 1. Top-Level Overview (Stat Cards Row)

A row of 5–6 summary cards, always visible at the top of the dashboard.

| Card                    | Data Required                                                      | Notes                                                   |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| Total Revenue Collected | amount collected (today / MTD / YTD), % change vs. previous period | Needs a time-range toggle (Today / Week / Month / Year) |
| Total Outstanding Dues  | sum of all unpaid + partially paid fees                            | Should exclude waived amounts                           |
| Active Defaulters       | count of students with overdue payments                            | Clicking should jump to Defaulter Tracking section      |
| Transactions Today      | count + total amount                                               | Split by successful vs. failed if possible              |
| Collection Efficiency % | (collected / total billed) × 100                                  | Useful as a single trust-building KPI                   |
| Upcoming Dues           | amount due in next 7 / 30 days                                     | Toggle between the two windows                          |

**Component needs**: each card = { label, value, delta (%), trend direction (up/down), time-range selector state }.

---

## 2. Revenue Breakdown & Charts

| Chart                              | Type                 | Data Required                                                          |
| ---------------------------------- | -------------------- | ---------------------------------------------------------------------- |
| Revenue by Fee Type                | Donut/Pie            | fee_type, total_amount, % of total                                     |
| Revenue by Payment Method          | Donut/Bar            | payment_method (UPI / Cash / Cheque), total_amount                     |
| Collection Trend Over Time         | Line/Area            | date, amount_collected — with daily/weekly/monthly granularity toggle |
| Class/Grade-wise Collection Status | Bar or Heatmap       | class_name, collected_amount, pending_amount                           |
| Reconciliation Status              | Progress bar / Donut | reconciled_amount vs. unreconciled_amount (cash + cheque only)         |

**Component needs**: each chart component should accept a `dateRange` prop and re-fetch/re-filter data reactively. Charts should support click-through — e.g., clicking a fee-type slice filters the Transactions Log by that fee type.

---

## 3. Defaulter Tracking (Priority Section)

This is a dedicated, prominent section — not a buried tab.

**List/table columns:**

- Student name + class/section
- Fee type(s) overdue
- Amount owed
- Days overdue
- Severity indicator (e.g., mild: 1–15 days, moderate: 16–30 days, severe: 30+ days)
- Parent contact (phone/email, shown inline)

**Sorting/filtering:**

- Sort by: amount owed (desc), days overdue (desc)
- Filter by: class, fee type, severity, overdue duration range

**Quick actions per row:**

- Send reminder (email/SMS)
- Call (tap-to-call if mobile-integrated)
- Apply penalty
- View full student ledger

**Component needs**: `DefaulterRow` = { studentId, name, class, feeTypes[], amountOwed, daysOverdue, severity, contact, actions[] }. Bulk-select support for applying an action to multiple defaulters at once.

---

## 4. Transactions Log

**Table columns:**

- Date/time
- Student name
- Fee type
- Amount
- Payment method (UPI / Cash / Cheque)
- Status (Paid / Pending / Failed / Bounced / Refunded)
- Processed by (staff member, for offline entries)

**Functionality:**

- Search by student name/ID
- Filter by: date range, fee type, payment method, status
- Row click → drill-down modal/page showing full transaction detail, receipt, and reconciliation status
- Export button (CSV/PDF)

**Component needs**: paginated/virtualized table, filter state persisted in URL or query params, export function tied to current filter state (not just current page).

---

## 5. Reconciliation Workspace

**Purpose**: match offline (cash/cheque) entries recorded by staff against actual bank confirmation.

**List of unreconciled entries:**

- Entry date, student, amount, method (cash/cheque), recorded by
- Cheque-specific fields: cheque number, bank name, deposit date, clearing status

**Actions:**

- Mark as reconciled (single or bulk)
- Flag discrepancy (amount mismatch, bounced cheque)
- On "bounced cheque" flag → automatically re-open the balance that transaction was settling

**Summary widget:**

- Total pending reconciliation amount
- Count of flagged/discrepant entries

**Component needs**: `ReconciliationEntry` = { transactionId, studentId, amount, method, chequeDetails?, recordedBy, status: pending/reconciled/flagged }.

---

## 6. Fee Structure Management

**Fee type list/table:**

- Fee name, category (Tuition/Transport/Late Fee/Custom), applicable to (class/grade/individual/whole school), amount, recurrence (one-time/monthly/yearly), due date rule

**Actions:**

- Create new fee type
- Edit existing fee type
- Deactivate/remove a fee type (soft delete — should not break historical records)
- Assign a fee to specific students/classes

**Late fee / penalty rules:**

- Trigger condition (e.g., X days after due date)
- Penalty amount or % of original fee
- Auto-apply toggle vs. manual approval

**Waivers/discounts management:**

- Apply waiver to student/fee (amount or %)
- Reason field (required)
- Approved-by field (audit trail)
- List of all active waivers, filterable by student/class

**Component needs**: `FeeType` = { id, name, category, targetScope, amount, recurrence, dueDateRule, penaltyRule? }. `Waiver` = { id, studentId, feeId, amountOrPercent, reason, approvedBy, appliedDate }.

---

## 7. Student/Parent Ledger View

- Search bar to look up any student instantly
- Full financial history per student: all fees billed, all payments made, all waivers applied, current outstanding balance
- Timeline view (chronological) of billing and payment events
- "Record payment" action directly from this view (for offline payments taken in person)

**Component needs**: `StudentLedger` = { studentId, billedItems[], payments[], waivers[], currentBalance }.

---

## 8. Quick Actions Panel

Contextual action buttons, shown based on current section/selection:

- Send payment reminder to all current defaulters
- Generate collection report (current filter/date range)
- Record a new cash/cheque payment manually
- Apply bulk late fee to a class/grade

**Component needs**: actions should be context-aware — e.g., only show "record cash payment" prominently when on Transactions or Student Ledger views.

---

## 9. Notifications / Activity Feed

- Chronological feed of system events: payment recorded, waiver approved, fee structure changed, cheque bounced, reconciliation completed
- Each entry: actor (which admin/staff), action, timestamp, affected student/record (linked)
- Anomaly alerts surfaced distinctly (e.g., failed UPI transaction, duplicate payment detected, bounced cheque)

**Component needs**: `ActivityEvent` = { id, actor, actionType, timestamp, relatedEntityId, relatedEntityType, isAnomaly }.

---

## 10. Reports & Export

**Pre-built report types:**

- Daily collection report
- Defaulter report
- Reconciliation report
- Fee-type-wise revenue report

**Custom reports:**

- Custom date range selection
- Filter by class/fee type/payment method before export
- Export formats: CSV, PDF

**Component needs**: a generic `ReportGenerator` that takes { reportType, dateRange, filters } and produces a downloadable file — reusable across all report types rather than one-off implementations per report.

---

## Layout Priority (Information Hierarchy)

1. **Top** → Current state (Overview stat cards)
2. **Upper-middle** → What needs attention now (Defaulter Tracking, Reconciliation Workspace)
3. **Middle** → Analysis (Revenue Breakdown & Charts)
4. **Lower** → Detailed records and management (Transactions Log, Fee Structure Management, Student Ledger)
5. **Persistent/global** → Quick Actions Panel and Notifications Feed, accessible from anywhere (e.g., sidebar or header, not buried in a tab)

---

## Cross-Cutting Requirements

- **Consistent status color coding** across all sections: green = collected/reconciled, amber = pending, red/rose = overdue/failed/bounced.
- **Every number on the dashboard must be traceable** back to underlying transaction records — no aggregate figure should exist without a drill-down path.
- **Role-based visibility** (if multiple admin roles exist) should be considered even if not implemented in v1 — e.g., who can approve waivers vs. who can only view reports.
- **Reactive/real-time updates**: metrics and lists should reflect new transactions without requiring a manual page refresh.
