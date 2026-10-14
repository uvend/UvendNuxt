import { getApiUrl, getStatementApi } from '../config'
import { authFetch, plainFetch } from '../http'

export async function getCurrentBatchList(params: {
  goBackMonths: number | string
  batchPaymentState?: number | string | null
}) {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionBatchPayment/GetCurrentBatchList`, {
    method: 'GET',
    params: {
      GoBackMonths: params.goBackMonths,
      BatchPaymentState: params.batchPaymentState,
    },
  })
}

export async function getPaymentBatch(paymentBatchId: string) {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionBatchPayment/GetPaymentBatch`, {
    method: 'GET',
    params: {
      PaymentBatchID: paymentBatchId,
    },
  })
}

export async function finalisePaymentBatch(paymentBatchId: string, settlementComment = '') {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionBatchPayment/FinalisePaymentBatch`, {
    method: 'POST',
    body: {
      settlementComment,
      paymentBatchID: paymentBatchId,
    },
  })
}

export async function rollbackSubmittedPaymentBatch(body: {
  paymentBatchID: string
  uniqueIdentifications: Array<string | number>
  comment?: string | null
}) {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionBatchPayment/RollBackSubmittedPaymentBatch`, {
    method: 'POST',
    body,
  })
}

export async function submitPaymentBatch(batchPaymentDataCollection: Array<Record<string, any>>) {
  return authFetch(`${getApiUrl()}/AdminSystem/TransactionBatchPayment/SubmitPaymentBatch`, {
    method: 'POST',
    body: {
      batchPaymentDataCollection,
    },
  })
}

export async function listGeneratedBankFiles(): Promise<{ batchIds: string[] }> {
  const base = getStatementApi()
  if (!base) return { batchIds: [] }
  const response = await plainFetch(`${base}/bankfile/generated`, { method: 'GET' })
  const ids = Array.isArray(response?.batchIds) ? response.batchIds : []
  return { batchIds: ids.map((id: any) => String(id)) }
}

export async function getGeneratedBankFile(batchId: string): Promise<{ generated: boolean }> {
  const base = getStatementApi()
  if (!base || !batchId) return { generated: false }
  const response = await plainFetch(`${base}/bankfile/generated/${encodeURIComponent(batchId)}`, {
    method: 'GET',
  })
  return { generated: Boolean(response?.generated) }
}

export async function generateCapitecBankFile(batchId: string) {
  const base = getStatementApi()
  if (!base) throw new Error('Statement API is not configured.')
  return authFetch(`${base}/bankfile/capitec`, {
    method: 'POST',
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
    },
    body: { batchId },
  })
}

export async function sendBatchEmail(batchId: string, options: { logOnly?: boolean } = {}) {
  const base = getStatementApi()
  if (!base) throw new Error('Statement API is not configured.')
  return authFetch(`${base}/statement/send-batch-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      batchId,
      logOnly: options.logOnly ?? false,
    },
  })
}

export async function getBatchEmailJob(jobId: string) {
  const base = getStatementApi()
  if (!base) throw new Error('Statement API is not configured.')
  return authFetch(`${base}/statement/send-batch-email/${encodeURIComponent(jobId)}`, {
    method: 'GET',
  })
}
