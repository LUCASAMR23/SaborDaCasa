export const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] as const
export const mealSlots = ['Café da manhã', 'Almoço', 'Jantar'] as const

export type Weekday = (typeof weekdays)[number]
export type MealSlot = (typeof mealSlots)[number]
export type PlannedMeal = {
  id: string
  day: Weekday
  meal: MealSlot
  recipeId: number
}

export const planStorageKey = 'sabor-da-casa-week-plan'

export function loadPlan(): PlannedMeal[] {
  try {
    const saved = JSON.parse(localStorage.getItem(planStorageKey) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function savePlan(plan: PlannedMeal[]) {
  localStorage.setItem(planStorageKey, JSON.stringify(plan))
}
