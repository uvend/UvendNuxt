<template>
    <Teleport to="body">
        <div 
            v-if="visible" 
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
            @click.self="dismiss"
        >
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div class="bg-amber-500 px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white">Inactive Meters Alert</h3>
                            <p class="text-amber-100 text-sm">Meters with no vending in 40+ days</p>
                        </div>
                    </div>
                </div>
                <div class="p-6 max-h-64 overflow-y-auto">
                    <p class="text-gray-600 text-sm mb-4">
                        The following meter(s) have not vended in the last 40 days. Please check their status.
                    </p>
                    <ul class="space-y-2 mb-4">
                        <li 
                            v-for="m in displayList" 
                            :key="m.meterNumber"
                            class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm"
                        >
                            <span class="font-medium text-gray-800">{{ m.meterNumber }}</span>
                            <span class="text-gray-500">{{ m.complexName }} · {{ m.daysSinceLastVend }} days</span>
                        </li>
                    </ul>
                </div>
                <div class="px-6 pb-6 space-y-3">
                    <div class="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" @click="snooze(1)" class="rounded-lg">
                            1 hour
                        </Button>
                        <Button size="sm" variant="outline" @click="snooze(5)" class="rounded-lg">
                            5 hours
                        </Button>
                        <Button size="sm" variant="outline" @click="snooze(24)" class="rounded-lg">
                            1 day
                        </Button>
                        <Button size="sm" variant="outline" @click="snooze(120)" class="rounded-lg">
                            5 days
                        </Button>
                    </div>
                    <div class="flex gap-2 pt-2 border-t">
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            @click="onIgnore"
                            class="rounded-lg flex-1"
                        >
                            Ignore
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            @click="dismiss"
                            class="rounded-lg"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    visible: { type: Boolean, default: false },
    meters: { type: Array, default: () => [] }
})

const { ignore, dismiss, snooze, isIgnored } = useInactiveMetersPopup()

const displayList = computed(() => {
    return (props.meters || []).filter(m => !isIgnored(m.meterNumber))
})

function onIgnore() {
    ignore(displayList.value.map(m => m.meterNumber))
}
</script>
