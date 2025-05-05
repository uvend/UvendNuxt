import type { BulletLegendItemInterface } from '@unovis/ts'

export { default as ChartCrosshair } from './ChartCrosshair.vue'
export { default as ChartLegend } from './ChartLegend.vue'
export { default as ChartSingleTooltip } from './ChartSingleTooltip.vue'
export { default as ChartTooltip } from './ChartTooltip.vue'

export const defaultColors = (length: number): string[] => {
  const baseColors = [
    '#2563eb', // blue-600
    '#16a34a', // green-600
    '#dc2626', // red-600
    '#ca8a04', // yellow-600
    '#9333ea', // purple-600
    '#0891b2', // cyan-600
    '#c2410c', // orange-600
    '#be185d', // pink-600
  ]

  // If we need more colors than in our base set, repeat them
  const colors: string[] = []
  for (let i = 0; i < length; i++) {
    colors.push(baseColors[i % baseColors.length])
  }
  return colors
}

export * from './interface'
