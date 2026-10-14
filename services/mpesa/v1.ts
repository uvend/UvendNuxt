import { getMpesaUrl } from '../config'
import { plainFetch } from '../http'

function requireMpesaBase(): string {
  const base = getMpesaUrl()
  if (!base) throw new Error('MPESA_URL is not configured')
  return base
}

function whatsappBase(): string {
  return `${requireMpesaBase()}/api/whatsapp`
}

export async function getStatus() {
  return plainFetch(`${requireMpesaBase()}/status`, { method: 'GET' })
}

export async function getTransactions(params: Record<string, any>) {
  return plainFetch(`${requireMpesaBase()}/api/admin/transactions`, {
    params,
  })
}

export async function resendSms(id: string | number) {
  return plainFetch(`${requireMpesaBase()}/api/admin/resend-sms`, {
    params: { id },
  })
}

export async function getWhatsAppStatus() {
  return plainFetch(`${whatsappBase()}/status`, { method: 'GET' })
}

export async function linkWhatsApp() {
  return plainFetch(`${whatsappBase()}/link`, { method: 'POST' })
}

export async function getWhatsAppQr() {
  return plainFetch(`${whatsappBase()}/qr`, { method: 'GET' })
}

export async function unlinkWhatsApp() {
  return plainFetch(`${whatsappBase()}/unlink`, { method: 'POST' })
}

export async function sendWhatsAppMessage(body: { phoneNumber: string; message: string }) {
  return plainFetch(`${whatsappBase()}/message`, {
    method: 'POST',
    body,
  })
}

export function isConfigured(): boolean {
  return Boolean(getMpesaUrl())
}
