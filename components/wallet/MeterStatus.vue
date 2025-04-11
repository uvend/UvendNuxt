<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Meter Status</CardTitle>
      <CardDescription>Current status of your utility meters</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="flex justify-center py-4">
        <Loader2Icon class="h-6 w-6 animate-spin" />
      </div>
      
      <div v-else-if="error" class="text-center py-4 text-red-500">
        {{ error }}
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="meter in meters" :key="meter.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ meter.name }}</h3>
              <p class="text-sm text-muted-foreground">ID: {{ meter.id }}</p>
            </div>
            <Badge :variant="getStatusVariant(meter.status)">
              {{ meter.status }}
            </Badge>
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">Last Reading</p>
              <p class="font-medium">{{ meter.lastReading || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Last Updated</p>
              <p class="font-medium">{{ formatDate(meter.lastUpdated) }}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            class="mt-4"
            @click="refreshMeterStatus(meter.id)"
          >
            <RefreshCwIcon class="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components';
import { Button } from '#components';
import { Badge } from '#components';
import { Loader2Icon, RefreshCwIcon } from 'lucide-vue-next';
import { useMeter } from '~/composables/useMeter';

const { meters, isLoading, error, fetchMeters, getMeterStatus } = useMeter();

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

const refreshMeterStatus = async (meterId) => {
  const status = await getMeterStatus(meterId);
  if (status) {
    const meterIndex = meters.value.findIndex(m => m.id === meterId);
    if (meterIndex !== -1) {
      meters.value[meterIndex] = { ...meters.value[meterIndex], ...status };
    }
  }
};

onMounted(() => {
  fetchMeters();
});
</script> 