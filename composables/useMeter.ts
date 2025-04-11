import { ref } from 'vue';

export const useMeter = () => {
  const meters = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

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
        throw new Error('Failed to fetch meters');
      }
      
      const data = await response.json();
      meters.value = data;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching meters:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const getMeterStatus = async (meterId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/meters/${meterId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch meter status');
      }
      
      return await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching meter status:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getMeterReadings = async (meterId: string, params = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/meters/${meterId}/readings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet-access-token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch meter readings');
      }
      
      return await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching meter readings:', err);
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
    getMeterReadings
  };
};