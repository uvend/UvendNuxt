<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Card</DialogTitle>
        <DialogDescription>
          Add a new payment card to your wallet
        </DialogDescription>
      </DialogHeader>
      <AddCardForm 
        @submit="handleSubmit"
        @cancel="$emit('update:open', false)"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#components';
import AddCardForm from './AddCardForm.vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:open', 'submit']);

const handleSubmit = (formData) => {
  emit('submit', formData);
  emit('update:open', false);
};
</script> 