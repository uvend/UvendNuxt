import { getApiUrl } from '../config'
import { authFetch } from '../http'

export async function getCurrentTransactionPeriodTotals(goBackMonths: number | string) {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionPeriod/GetCurrentTransactionPeriodTotals`, {
    method: 'GET',
    params: {
      GoBackMonths: goBackMonths,
    },
  })
}
