<template>
  <div class="p-8 bg-muted min-h-screen">
    <div class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto items-stretch lg:h-[170px]">
      <!-- Line chart card -->
      <div class="flex-1 min-w-[280px] h-full">
        <Card class="h-full">
          <CardContent class="p-0 h-full flex flex-col">
            <div class="relative w-full h-24 flex items-center justify-center overflow-hidden py-4">
              <LineChart
                :data="data"
                index="day"
                :categories="['amount']"
                :y-formatter="(tick) => tick ? `$${Number(tick).toLocaleString()}` : ''"
                :show-legend="false"
                :show-x-axis="false"
                :show-y-axis="false"
                :show-grid-line="false"
                :show-tooltip="false"
                class="!w-full !h-full"
              />
            </div>
            <div class="p-4 pt-0">
              <div class="flex flex-row items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold">$147,133.47</span>
                  <span class="flex items-center text-green-600 font-semibold text-sm">
                    +8%
                  </span>
                </div>
              </div>
              <CardDescription>Total amount</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- Bar chart card -->
      <div class="flex-1 min-w-[280px] h-full">
        <Card class="h-full">
          <CardContent class="p-0 h-full flex flex-col">
            <div class="relative w-full h-24 flex items-center justify-center overflow-hidden py-4">
              <BarChart
                :data="barCardData"
                index="day"
                :categories="['amount']"
                :colors="['#f59e42']"
                :show-legend="false"
                :show-x-axis="false"
                :show-y-axis="false"
                :show-grid-line="false"
                :show-tooltip="false"
                :rounded-corners="2"
                class="!w-full !h-full"
              />
            </div>
            <div class="p-4 pt-0">
              <div class="flex flex-row items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold">$147,133.47</span>
                  <span class="flex items-center text-green-600 font-semibold text-sm">
                    +8%
                  </span>
                </div>
              </div>
              <CardDescription>Total amount</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- Area chart card -->
      <div class="flex-1 min-w-[280px] h-full">
        <Card class="h-full">
          <CardContent class="flex flex-row items-center justify-between gap-4 p-0 h-full overflow-hidden">
            <div class="flex-1 flex flex-col items-start justify-center p-4">
              <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold">$147,133.47</span>
                <span class="flex items-center text-green-600 font-semibold text-sm">
                  +8%
                </span>
              </div>
              <CardDescription class="mt-2">Total amount</CardDescription>
            </div>
            <div class="w-1/2 min-w-[100px] h-full pt-4 pb-0 p-0 m-0 border-l border-gray-200 shadow-lg overflow-hidden">
              <div class="-ml-8 -mr-8 w-[calc(100%+4rem)] h-full">
                <AreaChart
                  :data="data"
                  index="day"
                  :categories="['amount']"
                  :y-formatter="(tick) => tick ? `$${Number(tick).toLocaleString()}` : ''"
                  :show-legend="false"
                  :show-x-axis="false"
                  :show-y-axis="false"
                  :show-grid-line="false"
                  :show-tooltip="false"
                  :margin="{ left: 0, right: 0, top: 0, bottom: 0 }"
                  class="!w-full !h-full !p-0 !m-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <!-- Bar Chart Section -->
    <div class="max-w-6xl mx-auto mt-12">
      <Card>
        <CardContent class="p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <div class="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="7" y="7" width="3" height="9" fill="currentColor"/><rect x="14" y="7" width="3" height="5" fill="currentColor"/></svg>
                Bar Chart
              </div>
              <div class="font-semibold text-lg">Bar Chart - <span class="font-bold">Interactive</span></div>
              <div class="text-muted-foreground text-sm">Showing total visitors for the last 3 months</div>
            </div>
            <div class="flex gap-8">
              <div class="flex flex-col items-center">
                <div class="text-xs text-muted-foreground">Desktop</div>
                <div class="text-2xl font-bold">24,828</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs text-muted-foreground">Mobile</div>
                <div class="text-2xl font-bold">25,010</div>
              </div>
            </div>
          </div>
          <div class="w-full h-[350px]">
            <BarChart
              :data="barData"
              index="date"
              :categories="['visitors']"
              :colors="['#2563eb']"
              :show-legend="false"
              :show-x-axis="true"
              :show-y-axis="false"
              :show-grid-line="true"
              :rounded-corners="2"
              :margin="{ top: 10, bottom: 30, left: 0, right: 0 }"
              :y-formatter="(tick) => tick ? Number(tick).toLocaleString() : ''"
              :x-formatter="(tick) => tick"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>

const daysInMonth = 30;
const data = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;
  return {
    day: day.toString(),
    amount: Math.round(1200 + 400 * Math.sin(i / 5) + Math.random() * 200)
  };
});

const data2 = [
  { day: 'Mon', amount: 100 },
  { day: 'Tue', amount: 120 },
  { day: 'Wed', amount: 110 },
  { day: 'Thu', amount: 140 },
  { day: 'Fri', amount: 130 },
  { day: 'Sat', amount: 160 },
  { day: 'Sun', amount: 150 }
]

const barCardData = data;

// Generate 3 months of demo bar chart data
const barData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 3, 1 + i) // April 1, 2024
  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return {
    date: label,
    visitors: Math.floor(1000 + Math.random() * 2000 * Math.abs(Math.sin(i / 7)))
  }
})
</script>

<style scoped>
</style>