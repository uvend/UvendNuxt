/** Normalises admin meter-statement responses (legacy uses `data`, Kenya admin uses `responseData`). */
export function summarisedPayload(result) {
    return result?.data ?? result?.responseData ?? {}
}
