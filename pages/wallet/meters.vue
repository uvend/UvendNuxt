


<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Utility Meters</h1>
        <p class="text-muted-foreground">Manage and monitor your utility meters</p>
      </div>
      <div class="flex items-center space-x-4">
        <Button variant="outline" @click="refreshAllMeters">
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          Refresh All
        </Button>
        <Button @click="showAddMeter = true">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Meter
        </Button>
      </div>
    </div>

    <!-- Meter Status -->
    <MeterStatus />

    <!-- Meter Readings Chart -->
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Meter Readings</CardTitle>
        <CardDescription>Historical consumption data</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoadingReadings" class="flex justify-center py-4">
          <Loader2Icon class="h-6 w-6 animate-spin" />
        </div>
        <div v-else-if="readingsError" class="text-center py-4 text-red-500">
          {{ readingsError }}
        </div>
        <div v-else>
          <!-- Add your chart component here -->
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart will be displayed here
          </div>
        </div>
      </CardContent>
    </Card>
    <div v-else>
      <Card v-if="meters" v-for="meter in meters" class="p-2 my-3">
          {{ meter }}
      </Card>
      <Card v-else class="py-8 text-center text-gray-500">
          No transactions found
      </Card>
    </div>
</div>    
</template>

<script>


import MeterCard from '@/components/wallet/MeterCard.vue';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({
    layout: 'wallet'
})
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#components';
import { Button } from '#components';
import { Badge } from '#components';
import { PlusIcon, RefreshCwIcon, Loader2Icon } from 'lucide-vue-next';
import MeterStatus from '~/components/wallet/MeterStatus.vue';
import { useMeter } from '~/composables/useMeter';

const showAddMeter = ref(false);
const isLoadingReadings = ref(false);
const readingsError = ref(null);

const { meters, isLoading, error, fetchMeters, getMeterStatus, getMeterReadings } = useMeter();

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'destructive';
    case 'maintenance':
      return 'warning';
    default:
      return 'secondary';
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const refreshAllMeters = async () => {
  await fetchMeters();
  // Refresh status for each meter
  for (const meter of meters.value) {
    const status = await getMeterStatus(meter.id);
    if (status) {
      const meterIndex = meters.value.findIndex(m => m.id === meter.id);
      if (meterIndex !== -1) {
        meters.value[meterIndex] = { ...meters.value[meterIndex], ...status };
      }
    }
    
  }
  </script>