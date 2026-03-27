/**
 * Composable for meter activity status (last vend date, 30/40 day inactive).
 * Fetches meter data and computes lastVendDate per meter.
 */
export function useMeterActivity() {
    const metersWithLastVend = useState('metersWithLastVend', () => [])
    const inactive40Days = useState('inactive40Days', () => [])
    const lastFetch = useState('meterActivityLastFetch', () => null)
    const CACHE_MS = 5 * 60 * 1000 // 5 min cache

    const DAYS_INACTIVE = 30
    const DAYS_POPUP = 40

    async function fetchAndCompute(customerId) {
        if (!customerId) return
        const now = Date.now()
        if (lastFetch.value && now - lastFetch.value < CACHE_MS) return

        try {
            const today = new Date()
            const start = new Date(today)
            start.setDate(today.getDate() - 90)
            const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`, {
                method: 'GET',
                params: {
                    IncludeMetersWithNoActivity: true,
                    StartDate: start.toISOString(),
                    EndDate: today.toISOString(),
                    ReportParentType: 4,
                    ResponseFormatType: 0,
                    ParentUniqueID: customerId,
                    UtilityType: -1
                }
            })
            lastFetch.value = now
            const transactionData = result?.data?.transactionData || {}
            const list = []
            const todayTime = today.getTime()

            for (const [meterKey, meterData] of Object.entries(transactionData)) {
                let lastVendDate = null
                let meterNumber = meterKey
                let installationId = null
                let complexName = null
                let utilityType = null
                let address0 = null

                if (meterData?.transactions?.length) {
                    for (const txn of meterData.transactions) {
                        const d = txn.row_creation_date || txn.transactionDate || txn.StartDate
                        if (d) {
                            const t = new Date(d).getTime()
                            if (!lastVendDate || t > lastVendDate) lastVendDate = t
                        }
                    }
                    const first = meterData.transactions[0]
                    meterNumber = first.meternumber || meterKey
                    installationId = first.meterinstallationuniqueid || first.installationUniqueId
                    complexName = first.complexDescription || first.complexName
                    utilityType = first.utilitytype === 1 ? 'Water' : 'Electricity'
                    address0 = first.address0
                }

                const daysSince = lastVendDate ? (todayTime - lastVendDate) / (24 * 60 * 60 * 1000) : 999
                list.push({
                    meterNumber,
                    installationUniqueId: installationId,
                    complexName: complexName || 'N/A',
                    utilityType: utilityType || 'Unknown',
                    address: address0 || 'N/A',
                    lastVendDate: lastVendDate ? new Date(lastVendDate) : null,
                    daysSinceLastVend: Math.floor(daysSince),
                    isActive: daysSince <= DAYS_INACTIVE,
                    is40DaysInactive: daysSince >= DAYS_POPUP
                })
            }

            metersWithLastVend.value = list
            inactive40Days.value = list.filter(m => m.is40DaysInactive)
        } catch (e) {
            console.error('useMeterActivity fetch failed', e)
            metersWithLastVend.value = []
            inactive40Days.value = []
        }
    }

    return {
        metersWithLastVend,
        inactive40Days,
        fetchAndCompute,
        DAYS_INACTIVE,
        DAYS_POPUP
    }
}
