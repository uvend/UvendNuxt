<template>
    <ScrollArea class="flex gap-2 w-full md:w-auto h-fit">
        <div class="flex gap-2 w-full hide-scrollbar" style="overflow-x: scroll;">
            <Button v-for="data in modelValue" size="sm" variant="outline" class="flex-1 sm:flex-none bg-white" @click="setDateRange(data.key)">{{ data.value }}</Button>
        </div>
      </ScrollArea>
</template>
<script>
export default {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
  data() {
    return {
      // your internal data here
    }
  },
  methods:{
    setDateRange(value){
      this.$store.utilityType = value
      console.log(value)
    }
  }
}
</script>