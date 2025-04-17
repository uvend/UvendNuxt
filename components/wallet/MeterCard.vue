<template>
  <Card class="p-4">
    <div class="flex flex-col space-y-3">
      <!-- Header with name and status -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">{{ meter.name }}</h3>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
          :class="meter.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
        >
          {{ meter.active ? 'Active' : 'Inactive' }}
        </span>
      </div>
      
      <!-- Meter details -->
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="text-gray-500">Meter Number:</div>
        <div class="font-medium">{{ meter.meterNumber }}</div>
        
        <div class="text-gray-500">ID:</div>
        <div class="font-medium">{{ meter.id }}</div>
        
        <div class="text-gray-500">Created:</div>
        <div class="font-medium">{{ formatDate(meter.created) }}</div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-between items-center pt-2">
        <button class="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <svg 
            class="h-5 w-5 mr-1" 
            :class="meter.favourite ? 'text-yellow-400' : 'text-gray-400'" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ meter.favourite ? 'Favorited' : 'Add to favorites' }}
        </button>
        
        <button 
          class="text-sm font-medium text-blue-600 hover:text-blue-800"
          @click="openViewDialog"
        >
          View meter Details
        </button>
        
        <Button @click="openEditDialog">Edit meter</Button>
      </div>
    </div>
    
    <!-- Edit Dialog -->
    <Dialog :open="isEditDialogOpen" @update:open="isEditDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Meter</DialogTitle>
          <DialogDescription>Edit details for {{ meter.name }}</DialogDescription>
        </DialogHeader>
        
        <div class="py-4 space-y-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="meter-name" class="text-right">Name</Label>
            <Input id="meter-name" v-model="editedMeter.name" class="col-span-3" />
          </div>
          
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="meter-number" class="text-right">Meter Number</Label>
            <Input id="meter-number" v-model="editedMeter.meterNumber" class="col-span-3" />
          </div>
          
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="meter-active" class="text-right">Status</Label>
            \
          </div>
          
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="meter-favourite" class="text-right">Favorite</Label>
            
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="isEditDialogOpen = false">Cancel</Button>
          <Button @click="saveMeterChanges">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- View Details Dialog -->
    <Dialog :open="isViewDialogOpen" @update:open="isViewDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meter Details</DialogTitle>
          <DialogDescription>Details for {{ meter.name }}</DialogDescription>
        </DialogHeader>
        
        <div class="py-4">
          <div class="space-y-4">
            <!-- Basic Information -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h4 class="font-medium text-gray-800 mb-2">Basic Information</h4>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="text-gray-500">Name:</div>
                <div class="font-medium">{{ meter.name }}</div>
                
                <div class="text-gray-500">ID:</div>
                <div class="font-medium">{{ meter.id }}</div>
                
                <div class="text-gray-500">Meter Number:</div>
                <div class="font-medium">{{ meter.meterNumber }}</div>
                
                <div class="text-gray-500">Status:</div>
                <div class="font-medium" :class="meter.active ? 'text-green-600' : 'text-gray-600'">
                  {{ meter.active ? 'Active' : 'Inactive' }}
                </div>
                
                <div class="text-gray-500">Created Date:</div>
                <div class="font-medium">{{ formatDate(meter.created) }}</div>
                
                <div class="text-gray-500">Favorite:</div>
                <div class="font-medium flex items-center">
                  <svg 
                    class="h-4 w-4 mr-1" 
                    :class="meter.favourite ? 'text-yellow-400' : 'text-gray-400'" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ meter.favourite ? 'Yes' : 'No' }}
                </div>
              </div>
            </div>
            
            <!-- Additional Information -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h4 class="font-medium text-gray-800 mb-2">Additional Information</h4>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="text-gray-500">Location:</div>
                <div class="font-medium">{{ meter.location || 'Not specified' }}</div>
                
                <div class="text-gray-500">Last Reading:</div>
                <div class="font-medium">{{ meter.lastReading || 'No reading available' }}</div>
                
                <div class="text-gray-500">Installation Date:</div>
                <div class="font-medium">{{ meter.installDate || 'Not specified' }}</div>
                
                <div class="text-gray-500">Wallet Balance:</div>
                <div class="font-medium">£{{ walletBalance.toFixed(2) }}</div>
              </div>
            </div>
            
            <!-- Transaction History Placeholder -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h4 class="font-medium text-gray-800 mb-2">Recent Transactions</h4>
              <div class="text-center text-gray-500 py-2">
                No recent transactions found
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button @click="isViewDialogOpen = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script>
import Card from '../ui/card/Card.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


export default {
  name: 'MeterCard',
  components: {
    Card,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Label,
    
  },
  props: {
    meter: {
      type: Object,
      required: true
    },
    walletBalance: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      isEditDialogOpen: false,
      isViewDialogOpen: false,
      editedMeter: {}
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    },
    openEditDialog() {
      // Create a copy of the meter object to avoid direct mutation
      this.editedMeter = { ...this.meter };
      this.isEditDialogOpen = true;
    },
    openViewDialog() {
      this.isViewDialogOpen = true;
    },
    saveMeterChanges() {
      // Here you would typically call your API to update the meter details
      // For example:
      // this.$emit('update-meter', this.editedMeter);
      
      // For demo purposes, let's just emit an event with the edited meter
      this.$emit('update-meter', this.editedMeter);
      
      // Close the dialog
      this.isEditDialogOpen = false;
    }
  }
};
</script>