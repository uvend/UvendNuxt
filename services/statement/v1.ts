import { getStatementApi, getStatementSummarisedPath } from '../config'
import { authFetch } from '../http'

export type SummarisedParams = Record<string, any>

export async function getSummarisedMeterActivity(params: SummarisedParams) {
  return authFetch(`${getStatementApi()}${getStatementSummarisedPath()}`, {
    method: 'GET',
    params,
  })
}

export async function getSummarisedMeterActivityPdf(params: SummarisedParams) {
  return authFetch(`${getStatementApi()}${getStatementSummarisedPath()}`, {
    method: 'GET',
    responseType: 'blob',
    params: {
      ...params,
      pdf: true,
    },
  })
}

export async function getDbMeterActivitySummarised(params: SummarisedParams) {
  return authFetch(`${getStatementApi()}/statement/GetDBMeterActivitySummarised`, {
    method: 'GET',
    params,
  })
}

export async function getDbMeterActivityPdf(params: SummarisedParams) {
  return authFetch(`${getStatementApi()}/statement/GetDBMeterActivity`, {
    method: 'GET',
    responseType: 'blob',
    params: {
      ...params,
      pdf: true,
    },
  })
}
