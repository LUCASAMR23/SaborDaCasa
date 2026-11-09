import { useState } from 'react'
import { mealSlots, type MealSlot, type PlannedMeal, type Weekday, weekdays } from './planning'

type RecipeOption = { id: number; title: string; time: string }
type Props = { recipes: RecipeOption[]; plan: PlannedMeal[]; onAdd: (day: Weekday, meal: MealSlot, recipeId: number) => void; onRemove: (id: string) => void }

export function WeeklyPlanner({ recipes, plan, onAdd, onRemove }: Props) {
  const [day, setDay] = useState<Weekday>('Segunda')
  const [meal, setMeal] = useState<MealSlot>('Jantar')
  const [recipeId, setRecipeId] = useState(recipes[0]?.id ?? 0)

  return <section className="weekly-planner" id="planejar" aria-labelledby="planner-title">
    <div className="planner-intro"><p className="eyebrow">ORGANIZE A SUA SEMANA</p><h2 id="planner-title">Planejamento semanal</h2><p>Distribua as receitas pelos dias e refeições que fazem sentido para você.</p></div>
    <form className="plan-form" onSubmit={(event) => { event.preventDefault(); if (recipeId) onAdd(day, meal, recipeId) }}>
      <label>Dia<select value={day} onChange={(event) => setDay(event.target.value as Weekday)}>{weekdays.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Refeição<select value={meal} onChange={(event) => setMeal(event.target.value as MealSlot)}>{mealSlots.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Receita<select value={recipeId} onChange={(event) => setRecipeId(Number(event.target.value))}>{recipes.map((recipe) => <option value={recipe.id} key={recipe.id}>{recipe.title} · {recipe.time}</option>)}</select></label>
      <button className="button primary" type="submit">Adicionar ao plano <span>→</span></button>
    </form>
    <div className="week-grid">{weekdays.map((weekday) => <article className="day-column" key={weekday}><h3>{weekday}</h3>{mealSlots.map((slot) => { const entries = plan.filter((item) => item.day === weekday && item.meal === slot); return <div className="meal-slot" key={slot}><b>{slot}</b>{entries.length ? entries.map((entry) => { const recipe = recipes.find((item) => item.id === entry.recipeId); return recipe && <div className="planned-recipe" key={entry.id}><span>{recipe.title}</span><button onClick={() => onRemove(entry.id)} aria-label={`Remover ${recipe.title} do plano`}>×</button></div> }) : <span className="empty-slot">Livre</span>}</div> })}</article>)}</div>
  </section>
}
