import { useEffect, useRef, useState } from 'react'
import { PriceSummary } from './PriceSummary'
import { loadPlan, savePlan, type MealSlot, type PlannedMeal, type Weekday } from './planning'
import { WeeklyPlanner } from './WeeklyPlanner'

type Ingredient = { name: string; amount: number; unit: string }
type Recipe = { id: number; title: string; description: string; time: string; minutes: number; difficulty: 'Fácil' | 'Média'; servings: number; category: string; image: string; alt: string; featured?: boolean; ingredients: Ingredient[]; steps: string[] }
type ShoppingItem = Ingredient & { id: string; checked: boolean }

const recipes: Recipe[] = [
  { id: 1, title: 'Bowl de legumes assados', description: 'Cremoso, colorido e pronto para entrar na sua rotina.', time: '35 min', minutes: 35, difficulty: 'Fácil', servings: 2, category: 'Vegetariana', image: '/images/hero-bowl.png', alt: 'Bowl com legumes assados e ervas frescas', featured: true, ingredients: [{ name: 'abobrinha', amount: 1, unit: 'un.' }, { name: 'cenoura', amount: 2, unit: 'un.' }, { name: 'grão-de-bico cozido', amount: 1, unit: 'xícara' }, { name: 'iogurte natural', amount: .5, unit: 'xícara' }, { name: 'azeite', amount: 2, unit: 'colheres de sopa' }, { name: 'ervas frescas', amount: 1, unit: 'punhado' }], steps: ['Aqueça o forno a 220 °C e corte os legumes.', 'Tempere com azeite e asse por 25 minutos.', 'Monte o bowl com o grão-de-bico, iogurte e ervas.'] },
  { id: 2, title: 'Massa cremosa de limão', description: 'Uma receita leve para um jantar que parece especial.', time: '25 min', minutes: 25, difficulty: 'Média', servings: 2, category: 'Jantar', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85', alt: 'Prato de massa cremosa com ervas', ingredients: [{ name: 'massa curta', amount: 180, unit: 'g' }, { name: 'iogurte natural', amount: 1, unit: 'xícara' }, { name: 'limão', amount: 1, unit: 'un.' }, { name: 'azeite', amount: 1, unit: 'colher de sopa' }, { name: 'ervas frescas', amount: 1, unit: 'punhado' }], steps: ['Cozinhe a massa em água salgada.', 'Misture o iogurte com suco e raspas de limão.', 'Envolva a massa no creme e finalize com ervas.'] },
  { id: 3, title: 'Panquecas de banana', description: 'Café da manhã macio, dourado e cheio de sabor.', time: '15 min', minutes: 15, difficulty: 'Fácil', servings: 2, category: 'Café da manhã', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', alt: 'Panquecas empilhadas com banana e frutas', ingredients: [{ name: 'banana madura', amount: 2, unit: 'un.' }, { name: 'ovo', amount: 2, unit: 'un.' }, { name: 'aveia em flocos', amount: .75, unit: 'xícara' }, { name: 'canela', amount: 1, unit: 'colher de chá' }], steps: ['Amasse as bananas e misture todos os ingredientes.', 'Aqueça uma frigideira antiaderente.', 'Doure pequenas porções dos dois lados.'] },
]

const categories = ['Tudo', 'Vegetariana', 'Jantar', 'Café da manhã']
const listStorageKey = 'sabor-da-casa-shopping-list'
const favoritesStorageKey = 'sabor-da-casa-favorites'
const displayAmount = (amount: number) => Number.isInteger(amount) ? String(amount) : amount.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

export default function App() {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [category, setCategory] = useState('Tudo')
  const [timeFilter, setTimeFilter] = useState('Qualquer tempo')
  const [difficulty, setDifficulty] = useState('Todas')
  const [saved, setSaved] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem(favoritesStorageKey) ?? '[]') } catch { return [] } })
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [servings, setServings] = useState(2)
  const [notice, setNotice] = useState('')
  const [list, setList] = useState<ShoppingItem[]>(() => { try { return JSON.parse(localStorage.getItem(listStorageKey) ?? '[]') } catch { return [] } })
  const [plan, setPlan] = useState<PlannedMeal[]>(loadPlan)

  useEffect(() => localStorage.setItem(listStorageKey, JSON.stringify(list)), [list])
  useEffect(() => localStorage.setItem(favoritesStorageKey, JSON.stringify(saved)), [saved])
  useEffect(() => savePlan(plan), [plan])
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  useEffect(() => { if (selected) closeButtonRef.current?.focus() }, [selected])

  const visible = recipes.filter((recipe) =>
    (category === 'Tudo' || recipe.category === category) &&
    (timeFilter === 'Qualquer tempo' || timeFilter === 'Até 20 min' ? recipe.minutes <= 20 : recipe.minutes <= 30) &&
    (difficulty === 'Todas' || recipe.difficulty === difficulty),
  )
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3400) }
  const openRecipe = (recipe: Recipe) => { setSelected(recipe); setServings(recipe.servings) }
  const addPlan = (day: Weekday, meal: MealSlot, recipeId: number) => { setPlan((entries) => [...entries, { id: crypto.randomUUID(), day, meal, recipeId }]); flash('Receita adicionada ao planejamento semanal.') }
  const removePlan = (id: string) => setPlan((entries) => entries.filter((entry) => entry.id !== id))
  const toggleItem = (id: string) => setList((items) => items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item))
  const addIngredients = () => {
    if (!selected) return
    const factor = servings / selected.servings
    setList((current) => {
      const next = [...current]
      selected.ingredients.forEach((ingredient) => {
        const index = next.findIndex((item) => item.name === ingredient.name && item.unit === ingredient.unit)
        if (index >= 0) next[index] = { ...next[index], amount: next[index].amount + ingredient.amount * factor, checked: false }
        else next.push({ ...ingredient, amount: ingredient.amount * factor, id: `${ingredient.name}-${ingredient.unit}`, checked: false })
      })
      return next
    })
    setSelected(null); flash('Ingredientes adicionados à sua lista de compras.')
  }

  return <main>
    <header className="topbar"><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><nav aria-label="Navegação principal"><a className="active" href="#receitas">Receitas</a><a href="#planejar">Planejar</a><a href="#lista">Lista <b className="list-count">{list.length}</b></a></nav><button className="profile" aria-label="Abrir perfil">LM</button></header>
    <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow">COMER BEM, SEM COMPLICAR</p><h1>Receitas que dão vontade de voltar para a cozinha.</h1><p className="hero-text">Descubra ideias acolhedoras para todos os dias e monte sua próxima lista de compras em poucos toques.</p><div className="hero-actions"><a className="button primary" href="#receitas">Explorar receitas <span>→</span></a><a className="button quiet" href="#planejar">Planejar semana <span>↗</span></a></div></div><div className="hero-art"><img src="/images/hero-bowl.png" alt="Bowl de legumes assados em uma mesa clara" /><div className="hero-note"><b>✦ 25 min</b><span>simples, bonito e gostoso</span></div></div></section>
    <section className="explore" id="receitas"><div className="section-heading"><div><p className="eyebrow">COMECE POR AQUI</p><h2>Feitas para a sua semana</h2></div></div><div className="filters" aria-label="Categorias de receita">{categories.map((filter) => <button key={filter} className={category === filter ? 'selected' : ''} onClick={() => setCategory(filter)}>{filter}</button>)}</div><div className="advanced-filters"><label>Tempo<select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}><option>Qualquer tempo</option><option>Até 20 min</option><option>Até 30 min</option></select></label><label>Dificuldade<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Todas</option><option>Fácil</option><option>Média</option></select></label></div><div className="recipe-grid">{visible.map((recipe) => <article className={`recipe-card ${recipe.featured ? 'large' : ''}`} key={recipe.id}><div className="recipe-image"><img src={recipe.image} alt={recipe.alt} /><button className={saved.includes(recipe.id) ? 'heart saved' : 'heart'} onClick={() => setSaved((items) => items.includes(recipe.id) ? items.filter((id) => id !== recipe.id) : [...items, recipe.id])} aria-label={`${saved.includes(recipe.id) ? 'Remover' : 'Salvar'} ${recipe.title}`}>{saved.includes(recipe.id) ? '♥' : '♡'}</button>{recipe.featured && <span className="tag">Favorita da semana</span>}</div><div className="recipe-copy"><div className="recipe-meta"><span>{recipe.time}</span><span>•</span><span>{recipe.difficulty}</span></div><h3>{recipe.title}</h3><p>{recipe.description}</p><button className="recipe-link" onClick={() => openRecipe(recipe)}>Ver receita <span>→</span></button></div></article>)}</div>{visible.length === 0 && <p className="no-results">Nenhuma receita encontrada com esses filtros.</p>}</section>
    <WeeklyPlanner recipes={recipes} plan={plan} onAdd={addPlan} onRemove={removePlan} />
    <section className="shopping-section" id="lista"><div className="shopping-heading"><div><p className="eyebrow">PARA A PRÓXIMA IDA AO MERCADO</p><h2>Lista de compras</h2><p>Os itens ficam salvos neste navegador.</p></div>{list.length > 0 && <button className="clear-list" onClick={() => setList([])}>Limpar lista</button>}</div>{list.length ? <><ul className="shopping-list">{list.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} aria-label={`Marcar ${item.name} como comprado`} /><span className={item.checked ? 'done' : ''}>{item.name}</span></label><span>{displayAmount(item.amount)} {item.unit}</span><button onClick={() => setList((items) => items.filter((value) => value.id !== item.id))} aria-label={`Remover ${item.name}`}>×</button></li>)}</ul><PriceSummary items={list} /></> : <div className="empty-list"><span>✦</span><h3>Sua lista está vazia</h3><p>Escolha uma receita e adicione os ingredientes que precisa comprar.</p><a className="button primary" href="#receitas">Explorar receitas</a></div>}</section>
    <footer><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><span>Seu cantinho para cozinhar com calma.</span><span>Dia 3 de 5</span></footer>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-title" onMouseDown={(event) => event.stopPropagation()}><button ref={closeButtonRef} className="close-modal" onClick={() => setSelected(null)} aria-label="Fechar receita">×</button><img className="modal-image" src={selected.image} alt={selected.alt} /><div className="modal-content"><div className="recipe-meta"><span>{selected.time}</span><span>•</span><span>{selected.category}</span></div><h2 id="recipe-title">{selected.title}</h2><p className="modal-description">{selected.description}</p><div className="servings"><div><b>Porções</b><span>ajuste antes de adicionar</span></div><div className="serving-control"><button onClick={() => setServings((value) => Math.max(1, value - 1))} aria-label="Diminuir porções">−</button><strong>{servings}</strong><button onClick={() => setServings((value) => value + 1)} aria-label="Aumentar porções">+</button></div></div><div className="detail-columns"><div><h3>Ingredientes</h3><ul className="ingredients">{selected.ingredients.map((ingredient) => <li key={ingredient.name}><span>{ingredient.name}</span><b>{displayAmount(ingredient.amount * servings / selected.servings)} {ingredient.unit}</b></li>)}</ul></div><div><h3>Modo de preparo</h3><ol className="steps">{selected.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></div><button className="button primary add-button" onClick={addIngredients}>Adicionar ingredientes à lista <span>→</span></button></div></section></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>
}
