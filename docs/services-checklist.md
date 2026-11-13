# Services migration checklist (UvendNuxt)

Inventory of screens that call **statement-api**, **AdminSystem** (`API_URL`), **Vend**, **Customer API**, **Mpesa**, or **Wallet**, taken from **`main` @ `e653166`** (includes invoices, 10 Nov 2026).

**No code moves in this ticket.** Use this as the script for later service-layer QA after `feature/jared/api-services` (MYV-75) lands.

Suggested modules match the `services/` tree on `origin/feature/jared/api-services` (`statementService`, `batchService`, `paymentsService`, `vendService`, `customerService`, `aeonService`, `authService`, `mpesaService`). Wallet stays on `useWalletAuthFetch` unless a later ticket says otherwise.

### Legend

| Column | Meaning |
|--------|---------|
| **On main today** | Inline `useAuthFetch` / `$fetch` / `fetch` on current `main` |
| **api-services** | Already wrapped on Jared’s branch (`Yes` / `Partial` / `No` / `N/A`) |
| **QA** | Fill ☐ / ✅ / ❌ when smoke-testing |

---

## 1. Page / screen checklist

### Auth & landing

| Page | Current call (inline) | Backend | Suggested service | api-services | QA |
|------|----------------------|---------|-------------------|--------------|----|
| `pages/login.vue` | `$fetch` → `VEND_URL/.../ValidateUser` | Vend | `authService.validateUser` | Yes | ☐ |
| `pages/index.vue` | `useAuthFetch` → `CUSTOMER_API` + `customer` | Customer API | `customerService.listCustomers` | Yes | ☐ |

### Customer portal (`pages/my/[customer_id]/…`)

| Page | Current call (inline) | Backend | Suggested service | api-services | QA |
|------|----------------------|---------|-------------------|--------------|----|
| `dashboard.vue` | `GetDBMeterActivitySummarised`; `MeterVend/GetMeterReport` | statement-api; Vend | `statementService.getDbMeterActivitySummarised`; `vendService.getMeterReport` | Yes | ☐ |
| `transactions.vue` | summarised path; `GetMeterReport`; `GetDBMeterActivity` (blob) | statement-api; Vend | `statementService.getSummarisedMeterActivity` / `getDbMeterActivityPdf`; `vendService.getMeterReport` | Yes | ☐ |
| `statement.vue` | summarised (+ PDF); `GetMeterReport`; `GetCustomerMeterInstallationList` | statement-api; Vend; AdminSystem | `statementService.*`; `vendService.getMeterReport`; `customerService.getCustomerMeterInstallationList` | Yes | ☐ |
| `meters/index.vue` | summarised; `GetMeterReport` | statement-api; Vend | `statementService.*`; `vendService.getMeterReport` | Yes | ☐ |
| `meters/[meter_id].vue` | summarised (×2); `GetMeterReport`; `$fetch` tenant GET/PUT; `GetMeterInfo`; `SetMeterBlockState`; `GetMeterTamperToken` | statement-api; Customer API; Vend | `statementService.*`; `customerService.getMeterTenant` / `updateMeterTenant`; `vendService.*` | Yes | ☐ |
| **`invoices.vue`** | `useAuthFetch` → `STATEMENT_API/invoices` | statement-api | `statementService` **(+ new `getInvoice` / similar — not on branch yet)** | **No** | ☐ |

Also used by customer UI: `composables/useMeterActivity.js` → summarised path → `statementService` (Yes).

### Admin (`pages/admin/account/…` and related)

| Page | Current call (inline) | Backend | Suggested service | api-services | QA |
|------|----------------------|---------|-------------------|--------------|----|
| `payments.vue` | period totals (×2); `SubmitPaymentBatch` | AdminSystem | `paymentsService.getCurrentTransactionPeriodTotals`; `batchService.submitPaymentBatch` | Yes | ☐ |
| `batch/index.vue` | `GetCurrentBatchList`; `$fetch` bankfile generated list | AdminSystem; statement-api | `batchService.getCurrentBatchList`; `batchService.listGeneratedBankFiles` | Yes | ☐ |
| `batch/[batch_id].vue` | `GetPaymentBatch`; bankfile generated status; `bankfile/capitec` | AdminSystem; statement-api | `batchService.getPaymentBatch` / `getGeneratedBankFile` / `generateCapitecBankFile` | Yes | ☐ |
| `mining.vue` | summarised meter activity | statement-api | `statementService.getSummarisedMeterActivity` | Yes (reuse statement) | ☐ |
| `aeon.vue` | `STATEMENT_API/aeon/check` (`AEON_CHECK` gates UI) | statement-api | `aeonService.checkFile` | Yes | ☐ |
| **`invoices.vue`** | `STATEMENT_API/invoices` | statement-api | **new statement invoice helper** | **No** | ☐ |
| `wallet/index.vue` | `useWalletAuthFetch` admin accounts / search | Wallet API | _(wallet — keep as-is for now)_ | N/A | ☐ |
| `wallet/[accountnumber]/index.vue` | meters, account, transactions, payments | Wallet API | _(wallet)_ | N/A | ☐ |
| `rollback.vue` | stub `fetch` placeholder URL | — | — | N/A (dead stub) | ☐ |

### Admin shared components

| Component | Current call | Backend | Suggested service | api-services | QA |
|-----------|--------------|---------|-------------------|--------------|----|
| `components/my/BatchFinaliseDialog.vue` | `FinalisePaymentBatch` | AdminSystem | `batchService.finalisePaymentBatch` | Yes | ☐ |
| `components/my/BatchRollBackDialog.vue` | `RollBackSubmittedPaymentBatch` | AdminSystem | `batchService.rollbackSubmittedPaymentBatch` | Yes | ☐ |
| `components/my/BatchSendStatement.vue` | `statement/send-batch-email` | statement-api | `batchService.sendBatchEmail` (+ job poll if used) | Yes | ☐ |
| `components/my/Tarrif.vue` | stub `fetch` | — | — | N/A | ☐ |
| `components/my/Transactionslip.vue` | stub `fetch` | — | — | N/A | ☐ |

### Mpesa (admin)

| Page | Current call | Backend | Suggested service | api-services | QA |
|------|--------------|---------|-------------------|--------------|----|
| `pages/admin/mpesa/requests.vue` | multiple `$fetch` → `MPESA_URL` | Mpesa | `mpesaService` (v1/v2 on branch) | Yes | ☐ |

### Wallet app (`APP_ENV=wallet` / `pages/wallet/**`)

Out of scope for statement/AdminSystem services merge. Calls use `useWalletAuthFetch` + `WALLET_API_URL` (login, meters, payments, tokens, etc.). Track separately if wallet is migrated later.

---

## 2. Remaining inline call sites on `main` (file list)

Files under `pages/`, `components/`, `composables/` with real `useAuthFetch` / `$fetch` / `fetch` to backends (**excluding** pure wallet `useWalletAuthFetch` sites). ~17 files:

### Statement-api / AdminSystem / Vend / Customer (services-merge targets)

1. `pages/login.vue`
2. `pages/index.vue`
3. `pages/my/[customer_id]/dashboard.vue`
4. `pages/my/[customer_id]/transactions.vue`
5. `pages/my/[customer_id]/statement.vue`
6. `pages/my/[customer_id]/meters/index.vue`
7. `pages/my/[customer_id]/meters/[meter_id].vue`
8. **`pages/my/[customer_id]/invoices.vue`** ← main-only vs api-services; **not wrapped**
9. `pages/admin/account/payments.vue`
10. `pages/admin/account/batch/index.vue`
11. `pages/admin/account/batch/[batch_id].vue`
12. `pages/admin/account/mining.vue`
13. `pages/admin/account/aeon.vue`
14. **`pages/admin/account/invoices.vue`** ← added ~10 Nov; **not wrapped**
15. `composables/useMeterActivity.js`
16. `components/my/BatchFinaliseDialog.vue`
17. `components/my/BatchRollBackDialog.vue`
18. `components/my/BatchSendStatement.vue`
19. `pages/admin/mpesa/requests.vue` (Mpesa `$fetch`)

### Stubs / placeholders (not production backends)

- `pages/admin/account/rollback.vue`
- `components/my/Tarrif.vue`
- `components/my/Transactionslip.vue`

### Explicit rebase gaps (main-only / missing from api-services)

| File | Why it matters |
|------|----------------|
| `pages/admin/account/invoices.vue` | New on main (10 Nov). Hits `STATEMENT_API/invoices`. **No** matching helper on `feature/jared/api-services`. |
| `pages/my/[customer_id]/invoices.vue` | Same endpoint, customer portal. Same gap. |

After rebasing api-services onto current `main`, these two will still be inline until a follow-up adds e.g. `statementService.getInvoice(...)`.

---

## 3. DEV baseline smoke (fill in)

Env: local / DEV image against DEV backends. **Do not paste secrets or full `.env` values.**

| Step | Expected | Result (date: 2026-11-13) | Notes |
|------|----------|----------------------------|-------|
| Admin login (`/login`) | Session / redirect works | ✅ | Redirects to customer list |
| Customer search (`/`) | List loads | ✅ | Select customer → portal |
| Open customer → dashboard | KPIs / chart load | ❌ | statement-api: `vendtransactions.commissionableamountincludessurcharge` missing on DEV DB |
| Transactions | Table loads | ❌ | Same missing-column error |
| Statement | Summary + PDF path | ❌ | Same missing-column error |
| Meters list + meter detail | Activity / block / tamper | ❌ | Same missing-column error (list); detail not separately noted |
| Customer invoices | Generate preview | ☐ | Not tested yet |
| Admin payments / submit batch | Loads; submit if safe | ✅ | Lists + filters OK (submit not required) |
| Admin batch list + batch detail | List; Capitec / bankfile if safe | ✅ | Lists + filters OK |
| Mining | Transactions for configured customer | ☐ | Not tested yet |
| Aeon (if `AEON_CHECK=1`) | Check upload | ☐ | Skipped — cannot test now |
| Admin invoices | Generate | ☐ | Not tested yet |
| Mpesa requests (if `MPESA_URL` set) | Status / list | ☐ | Not tested yet |
| Admin → admin portal | Redirect works | ✅ | |
| Wallet accounts / account detail | Loads | ✅ | View account OK |
| Wallet account transactions / payments / meters | Lists + filters | ✅ | |

Known limitations (from related tickets; not regressions of this inventory):

- Customer login / opaque public IDs vs statement-api may already fail depending on which identity stack DEV uses.
- Do not treat those as blockers for completing this checklist document.
- **DEV DB schema gap (2026-11-13):** local/DEV `uvend-statement-api` selects `v.commissionableamountincludessurcharge` in `src/service/dbMeterActivity.js`; that column is **not** on the DEV `vendtransactions` table Postgres is using. Breaks summarised meter activity → dashboard, transactions, meters, statement. AdminSystem / Wallet paths above still work. Fix is DB migration (add column) or temporarily drop the select/mapper field until DEV schema matches.

---

## 4. How to use this after MYV-75

1. For each row with **api-services = Yes**, swap the page to the service method and tick **QA**.
2. For **invoices** rows, add service methods first, then wire pages.
3. Re-run the DEV smoke table; compare to the baseline above.

## Related

- [Branching & releases](./branching.md)
- Upstream services branch: `origin/feature/jared/api-services`
