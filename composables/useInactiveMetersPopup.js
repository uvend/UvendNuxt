/**
 * Composable for the 40+ days inactive meters popup.
 * Manages snooze (1h, 5h, 1d, 5d) and ignore state in localStorage.
 */
const STORAGE_SNOOZE = 'inactiveMeters40SnoozeUntil'
const STORAGE_IGNORED = 'inactiveMeters40Ignored'

export function useInactiveMetersPopup() {
    const showPopup = useState('inactiveMetersPopupVisible', () => false)
    const snoozeUntil = useState('inactiveMetersSnoozeUntil', () => null)

    function getSnoozeUntil() {
        if (process.client) {
            const v = localStorage.getItem(STORAGE_SNOOZE)
            return v ? parseInt(v, 10) : null
        }
        return null
    }

    function isIgnored(meterNumber) {
        if (process.client) {
            try {
                const list = JSON.parse(localStorage.getItem(STORAGE_IGNORED) || '[]')
                return list.includes(meterNumber)
            } catch {
                return false
            }
        }
        return false
    }

    function shouldShow(inactive40List) {
        if (!inactive40List?.length) return false
        const notIgnored = inactive40List.filter(m => !isIgnored(m.meterNumber))
        if (!notIgnored.length) return false
        const until = getSnoozeUntil()
        if (until && Date.now() < until) return false
        return true
    }

    function snooze(hours) {
        const until = Date.now() + hours * 60 * 60 * 1000
        if (process.client) localStorage.setItem(STORAGE_SNOOZE, String(until))
        snoozeUntil.value = until
        showPopup.value = false
    }

    function ignore(meterNumbers) {
        if (!process.client) return
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_IGNORED) || '[]')
            meterNumbers.forEach(m => {
                if (!list.includes(m)) list.push(m)
            })
            localStorage.setItem(STORAGE_IGNORED, JSON.stringify(list))
        } catch {}
        showPopup.value = false
    }

    function dismiss() {
        showPopup.value = false
    }

    return {
        showPopup,
        snoozeUntil,
        getSnoozeUntil,
        isIgnored,
        shouldShow,
        snooze,
        ignore,
        dismiss
    }
}
