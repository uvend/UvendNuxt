export type MiningCustomerConfig = {
  code: number
  label: string
  enabled: boolean
}

export const miningCustomers: MiningCustomerConfig[] = [
  {
    code: 676,
    label: 'Mining Customer 676',
    enabled: true
  }
]

export function isMiningCustomerCode(code: number | string | null | undefined): boolean {
  const parsed = Number(code)
  if (!Number.isFinite(parsed)) return false
  return miningCustomers.some((customer) => customer.enabled && customer.code === parsed)
}
