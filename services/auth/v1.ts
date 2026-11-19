import { getVendUrl } from '../config'
import { plainFetch } from '../http'

export async function validateUser(username: string, password: string) {
  const credentials = btoa(`${username}:${password}`)
  const result = await plainFetch(`${getVendUrl()}/user/VendUserFunctions/ValidateUser`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })
  return { result, credentials }
}
