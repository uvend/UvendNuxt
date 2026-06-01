/** Normalises admin meter-statement responses (legacy uses `data`, Kenya admin uses `responseData`). */
export function summarisedPayload(result) {
    const raw = result?.data ?? result?.responseData ?? {}
    return normaliseSummarisedPayload(raw)
}

function normaliseSummarisedPayload(payload) {
    if (!payload || typeof payload !== 'object') return {}
    const out = { ...payload }

    if (Array.isArray(out.transactionData)) {
        out.transactionData = transactionArrayToLegacyMap(out.transactionData)
    }

    if (!out.summary && kenyaLooksLikeFlatTotals(out)) {
        out.summary = buildSummaryFromKenyaFlat(out)
    }

    return out
}

function kenyaLooksLikeFlatTotals(p) {
    return (
        p.totalAmountTendered != null
        || p.transactionEntryCount != null
        || (Array.isArray(p.tokenStatistics) && p.tokenStatistics.length > 0)
    )
}

function transactionArrayToLegacyMap(rows) {
    const map = {}
    for (const row of rows) {
        const key = String(row.meterNumber ?? row.meternumber ?? 'unknown')
        if (!map[key]) map[key] = { transactions: [] }
        map[key].transactions.push(kenyaRowToLegacyTxn(row))
    }
    return map
}

function kenyaRowToLegacyTxn(row) {
    const util = String(row.utilityType ?? '').toLowerCase()
    const utilitytype = util === 'water' ? 1 : 0
    const addr = row.installationAdress
    const address0 = Array.isArray(addr) ? (addr[0] ?? '') : ''
    const num = (v) => {
        if (v == null || v === '') return 0
        const n = parseFloat(String(v).replace(/,/g, ''))
        return Number.isFinite(n) ? n : 0
    }
    return {
        ...row,
        meternumber: row.meterNumber,
        complexDescription: row.complexName,
        address0,
        utilitytype,
        tenderedamount: num(row.tenderedAmount),
        totalunitsissued: num(row.totalUnitsIssued),
        row_creation_date: row.transactionDate,
        uniqueidentification: row.transactionUniqueId,
        vendCommissionAmount: num(row.commissionAmount)
    }
}

function buildSummaryFromKenyaFlat(p) {
    const num = (v) => {
        if (v == null || v === '') return 0
        const n = parseFloat(String(v).replace(/,/g, ''))
        return Number.isFinite(n) ? n : 0
    }
    const utilities = {}
    if (Array.isArray(p.tokenStatistics)) {
        for (const ts of p.tokenStatistics) {
            const ut = ts.utilityType || 'Any'
            utilities[ut] = { ...ts }
        }
    }
    return {
        managedTenredAmount: num(p.managedTenderAmount),
        nonManagedTenredAmount: num(p.nonManagedTenderAmount),
        tenderedamount: num(p.totalAmountTendered),
        surcharge0AmountInclVat: num(p.surchargeToServiceProvider),
        vendCommissionAmountIncVat: num(p.commissionAmount),
        vendRefund: num(p.amountPayableToCustomer),
        nonManagedTenderedAmountToVendor: num(p.nonManagedTenderAmount),
        grossvendamount: num(p.totalAmountTendered),
        vendamount: num(p.totalAmountTendered),
        vendCommission: { rate: num(p.commissionPercentage) },
        utilities
    }
}
