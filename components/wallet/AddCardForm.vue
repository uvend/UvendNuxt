<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Add New Card</CardTitle>
      <CardDescription>Enter your card details to add it to your wallet</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="cardName">Card Name</Label>
          <Input id="cardName" v-model="formData.cardName" placeholder="My Card" />
        </div>

        <div class="space-y-2">
          <Label for="cardNumber">Card Number</Label>
          <Input id="cardNumber" v-model="formData.cardNumber" placeholder="1234 5678 9012 3456" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" v-model="formData.expiryDate" placeholder="MM/YY" />
          </div>
          <div class="space-y-2">
            <Label for="cvv">CVV</Label>
            <Input id="cvv" v-model="formData.cvv" type="password" placeholder="123" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="cardType">Card Type</Label>
          <Select v-model="formData.cardType">
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit">Credit Card</SelectItem>
              <SelectItem value="debit">Debit Card</SelectItem>
              <SelectItem value="prepaid">Prepaid Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="$emit('cancel')">Cancel</Button>
          <Button type="submit">Add Card</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components';
import { Button } from '#components';
import { Input } from '#components';
import { Label } from '#components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#components';

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardType: ''
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script> 