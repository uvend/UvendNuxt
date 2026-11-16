import { getVendOperatorId, getVendTerminalId, getVendUrl } from '../config'
import { authFetch } from '../http'

function apiUserParams() {
  return {
    'ApiUserParams.TerminalID': getVendTerminalId(),
    'ApiUserParams.OperatorID': getVendOperatorId(),
    'ApiUserParams.RequestID': new Date(),
  }
}

export async function getMeterReport(params: Record<string, any>) {
  return authFetch(`${getVendUrl()}/MeterVend/GetMeterReport`, {
    method: 'GET',
    params,
  })
}

export async function getMeterInfo(meterNumber: string) {
  return authFetch(`${getVendUrl()}/MeterVend/GetMeterInfo`, {
    method: 'GET',
    params: {
      MeterNumber: meterNumber,
      ...apiUserParams(),
    },
  })
}

export async function setMeterBlockState(meterNumber: string, block: boolean) {
  return authFetch(`${getVendUrl()}/MeterVend/SetMeterBlockState`, {
    method: 'GET',
    params: {
      Block: block,
      MeterNumber: meterNumber,
      ...apiUserParams(),
    },
  })
}

export async function getMeterTamperToken(meterNumber: string) {
  return authFetch(`${getVendUrl()}/MeterVend/GetMeterTamperToken`, {
    method: 'GET',
    params: {
      MeterNumber: meterNumber,
      ...apiUserParams(),
    },
  })
}
