import { getStatementApi } from '../config'
import { authFetch } from '../http'

export async function checkFile(file: File | Blob, options: { signal?: AbortSignal } = {}) {
  const base = getStatementApi()
  if (!base) throw new Error('Statement API is not configured.')

  const formData = new FormData()
  formData.append('file', file)

  return authFetch(`${base}/aeon/check`, {
    method: 'POST',
    body: formData,
    signal: options.signal,
  })
}
