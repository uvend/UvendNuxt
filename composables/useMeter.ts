import { ref } from 'vue';

// Define types for meter data
interface Meter {
  id: string;
  name: string;
  type: string;
  status: string;
  lastReading?: number;
  lastUpdated?: string;
}

interface MeterReading {
  id: string;
  meterId: string;
  value: number;
  timestamp: string;
}

interface MeterStatus {
  id: string;
  status: string;
  lastReading?: number;
  lastUpdated?: string;
}

export const useMeter = () => {
  const meters = ref<Meter[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all meters
  const fetchMeters = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/meters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meters: ${response.statusText}`);
      }
      
      const data = await response.json();
      meters.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meters';
      console.error('Error fetching meters:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get status for a specific meter
  const getMeterStatus = async (meterId: string): Promise<MeterStatus | null> => {
    if (!meterId) {
      console.error('Meter ID is required');
      return null;
    }

    try {
      const response = await fetch(`/api/meters/${meterId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meter status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err: any) {
      console.error(`Error fetching status for meter ${meterId}:`, err);
      return null;
    }
  };

  // Get readings for a specific meter
  const getMeterReadings = async (meterId: string, params: Record<string, string> = {}): Promise<MeterReading[] | null> => {
    if (!meterId) {
      console.error('Meter ID is required');
      return null;
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/meters/${meterId}/readings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meter readings: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err: any) {
      console.error(`Error fetching readings for meter ${meterId}:`, err);
      return null;
    }
  };

  // Add a new meter
  const addMeter = async (meterData: Partial<Meter>): Promise<Meter | null> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/meters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        },
        body: JSON.stringify(meterData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add meter: ${response.statusText}`);
      }
      
      const newMeter = await response.json();
      meters.value.push(newMeter);
      return newMeter;
    } catch (err: any) {
      error.value = err.message || 'Failed to add meter';
      console.error('Error adding meter:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Remove a meter
  const removeMeter = async (meterId: string): Promise<boolean> => {
    if (!meterId) {
      console.error('Meter ID is required');
      return false;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/meters/${meterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove meter: ${response.statusText}`);
      }
      
      meters.value = meters.value.filter(meter => meter.id !== meterId);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to remove meter';
      console.error('Error removing meter:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Update a meter
  const updateMeter = async (meterId: string, updateData: Partial<Meter>): Promise<Meter | null> => {
    if (!meterId) {
      console.error('Meter ID is required');
      return null;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/meters/${meterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update meter: ${response.statusText}`);
      }
      
      const updatedMeter = await response.json();
      const index = meters.value.findIndex(meter => meter.id === meterId);
      if (index !== -1) {
        meters.value[index] = updatedMeter;
      }
      return updatedMeter;
    } catch (err: any) {
      error.value = err.message || 'Failed to update meter';
      console.error('Error updating meter:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    meters,
    isLoading,
    error,
    fetchMeters,
    getMeterStatus,
    getMeterReadings,
    addMeter,
    removeMeter,
    updateMeter
  };
};