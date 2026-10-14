import { getAdminAuth, getApiUrl, getCustomerApi } from '../config'
import { authFetch, plainFetch } from '../http'

function customerApiBase(): string {
  let baseUrl = getCustomerApi() || 'https://customer-api.uatvend.co.za'

  // If the URL contains two domains concatenated, extract the first one
  if (baseUrl.includes('https://') && baseUrl.indexOf('https://', 8) !== -1) {
    baseUrl = baseUrl.substring(0, baseUrl.indexOf('https://', 8))
  }

  if (!baseUrl.endsWith('/')) {
    baseUrl += '/'
  }

  return baseUrl
}

export async function listCustomers(params: {
  page?: number
  limit?: number
  search?: string
} = {}) {
  return authFetch(`${customerApiBase()}customer`, {
    method: 'GET',
    query: {
      page: params.page ?? 1,
      limit: params.limit ?? 100,
      search: params.search ?? '',
    },
  })
}

export async function getCustomerMeterInstallationList(customerUnique: string | number) {
  return authFetch(`${getApiUrl()}/AdminSystem/Customer/GetCustomerMeterInstallationList`, {
    method: 'GET',
    params: {
      CustomerUnique: customerUnique,
    },
    headers: {
      Authorization: `Basic ${getAdminAuth()}`,
    },
  })
}

export async function getMeterTenant(meterNumber: string) {
  return plainFetch(`${getCustomerApi()}/meter/${encodeURIComponent(meterNumber)}/tenant`, {
    method: 'GET',
  })
}

export async function updateMeterTenant(
  meterNumber: string,
  body: { firstname?: string; emailaddress?: string }
) {
  return plainFetch(`${getCustomerApi()}/meter/${encodeURIComponent(meterNumber)}/tenant`, {
    method: 'PATCH',
    body,
  })
}
