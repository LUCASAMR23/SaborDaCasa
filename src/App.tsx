import { useEffect, useRef, useState } from 'react'
import { AuthPage } from './AuthPage'
import { currentAccount, signOut, type Account } from './auth'
import { RecipeCreator, type UserRecipeDraft } from './RecipeCreator'
import { MarketBag } from './MarketBag'
import { loadPlan, savePlan, type MealSlot, type PlannedMeal, type Weekday } from './planning'
import { WeeklyPlanner } from './WeeklyPlanner'

type Ingredient = { name: string; amount: number; unit: string }
type Recipe = { id: number; title: string; description: string; time: string; minutes: number; difficulty: 'Fácil' | 'Média'; servings: number; category: string; image: string; alt: string; featured?: boolean; ingredients: Ingredient[]; steps: string[] }
type ShoppingItem = Ingredient & { id: string; checked: boolean }

const recipes: Recipe[] = [
  { id: 1, title: 'Bowl de legumes assados', description: 'Cremoso, colorido e pronto para entrar na sua rotina.', time: '35 min', minutes: 35, difficulty: 'Fácil', servings: 2, category: 'Vegetariana', image: '/images/hero-bowl.png', alt: 'Bowl com legumes assados e ervas frescas', featured: true, ingredients: [{ name: 'abobrinha', amount: 1, unit: 'un.' }, { name: 'cenoura', amount: 2, unit: 'un.' }, { name: 'grão-de-bico cozido', amount: 1, unit: 'xícara' }, { name: 'iogurte natural', amount: .5, unit: 'xícara' }], steps: ['Aqueça o forno a 220 °C.', 'Asse os legumes temperados por 25 minutos.', 'Monte com grão-de-bico, iogurte e ervas.'] },
  { id: 2, title: 'Massa cremosa de limão', description: 'Uma receita leve para um jantar que parece especial.', time: '25 min', minutes: 25, difficulty: 'Média', servings: 2, category: 'Jantar', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85', alt: 'Prato de massa cremosa com ervas', ingredients: [{ name: 'massa curta', amount: 180, unit: 'g' }, { name: 'iogurte natural', amount: 1, unit: 'xícara' }, { name: 'limão', amount: 1, unit: 'un.' }], steps: ['Cozinhe a massa.', 'Misture iogurte, limão e raspas.', 'Envolva a massa no creme.'] },
  { id: 3, title: 'Panquecas de banana', description: 'Café da manhã macio, dourado e cheio de sabor.', time: '15 min', minutes: 15, difficulty: 'Fácil', servings: 2, category: 'Café da manhã', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', alt: 'Panquecas empilhadas com banana e frutas', ingredients: [{ name: 'banana madura', amount: 2, unit: 'un.' }, { name: 'ovo', amount: 2, unit: 'un.' }, { name: 'aveia em flocos', amount: .75, unit: 'xícara' }], steps: ['Misture os ingredientes.', 'Aqueça a frigideira.', 'Doure dos dois lados.'] },
  { id: 4, title: 'Frango com ervas e raízes', description: 'Assadeira única, pouca louça e muito sabor.', time: '45 min', minutes: 45, difficulty: 'Fácil', servings: 3, category: 'Jantar', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85', alt: 'Frango assado com legumes e ervas', ingredients: [{ name: 'frango', amount: 500, unit: 'g' }, { name: 'cenoura', amount: 3, unit: 'un.' }, { name: 'ervas frescas', amount: 1, unit: 'punhado' }], steps: ['Disponha tudo em uma assadeira.', 'Tempere e asse até dourar.', 'Sirva ainda quente.'] },
  { id: 5, title: 'Salada morna de grãos', description: 'Colorida, prática e ótima para levar.', time: '20 min', minutes: 20, difficulty: 'Fácil', servings: 2, category: 'Vegetariana', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', alt: 'Salada colorida com folhas e grãos', ingredients: [{ name: 'grão-de-bico cozido', amount: 1, unit: 'xícara' }, { name: 'cenoura', amount: 1, unit: 'un.' }, { name: 'azeite', amount: 1, unit: 'colher de sopa' }], steps: ['Aqueça os grãos.', 'Corte os vegetais.', 'Misture e tempere.'] },
  { id: 6, title: 'Torrada com tomate e ricota', description: 'Uma pausa rápida com cara de café demorado.', time: '10 min', minutes: 10, difficulty: 'Fácil', servings: 2, category: 'Café da manhã', image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?auto=format&fit=crop&w=900&q=85', alt: 'Torradas com tomate e ervas', ingredients: [{ name: 'pão integral', amount: 4, unit: 'fatias' }, { name: 'tomate', amount: 2, unit: 'un.' }, { name: 'ricota', amount: 150, unit: 'g' }], steps: ['Torre o pão.', 'Tempere o tomate.', 'Cubra com ricota e tomate.'] },
]

const categories = ['Tudo', 'Vegetariana', 'Jantar', 'Café da manhã', 'Minhas receitas']
const listStorageKey = 'sabor-da-casa-shopping-list'
const favoritesStorageKey = 'sabor-da-casa-favorites'
const userRecipesStorageKey = 'sabor-da-casa-user-recipes'
const displayAmount = (amount: number) => Number.isInteger(amount) ? String(amount) : amount.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

export default function App() {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [account, setAccount] = useState<Account | null>(currentAccount)
  const [userRecipes, setUserRecipes] = useState<Recipe[]>(() => { try { return JSON.parse(localStorage.getItem(userRecipesStorageKey) ?? '[]') } catch { return [] } })
  const [category, setCategory] = useState('Tudo')
  const [search, setSearch] = useState('')
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
  useEffect(() => localStorage.setItem(userRecipesStorageKey, JSON.stringify(userRecipes)), [userRecipes])
  useEffect(() => savePlan(plan), [plan])
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  useEffect(() => { if (selected) closeButtonRef.current?.focus() }, [selected])

  const allRecipes = [...recipes, ...userRecipes]
  const normalizedSearch = normalizeSearch(search.trim())
  const visible = allRecipes.filter((recipe) => {
    const matchesCategory = category === 'Tudo' || recipe.category === category
    const matchesTime = timeFilter === 'Qualquer tempo' || (timeFilter === 'Até 20 min' ? recipe.minutes <= 20 : recipe.minutes <= 30)
    const matchesDifficulty = difficulty === 'Todas' || recipe.difficulty === difficulty
    const matchesSearch = !normalizedSearch || [recipe.title, recipe.description, recipe.category, ...recipe.ingredients.map((ingredient) => ingredient.name)].some((value) => normalizeSearch(value).includes(normalizedSearch))
    return matchesCategory && matchesTime && matchesDifficulty && matchesSearch
  })
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3400) }
  const addPlan = (day: Weekday, meal: MealSlot, recipeId: number) => { setPlan((entries) => [...entries, { id: crypto.randomUUID(), day, meal, recipeId }]); flash('Receita adicionada ao planejamento semanal.') }
  const addUserRecipe = (draft: UserRecipeDraft) => { setUserRecipes((items) => [...items, { id: Date.now(), title: draft.title, description: draft.description, time: `${draft.minutes} min`, minutes: draft.minutes, difficulty: draft.difficulty, servings: draft.servings, category: draft.category, image: draft.image || '/images/hero-bowl.png', alt: `Foto da receita ${draft.title}`, ingredients: draft.ingredients, steps: draft.steps }]); flash('Receita salva. Você já pode levá-la para a sacola.') }
  const addIngredients = () => { if (!selected) return; const factor = servings / selected.servings; setList((current) => { const next = [...current]; selected.ingredients.forEach((ingredient) => { const index = next.findIndex((item) => item.name === ingredient.name && item.unit === ingredient.unit); if (index >= 0) next[index] = { ...next[index], amount: next[index].amount + ingredient.amount * factor, checked: false }; else next.push({ ...ingredient, amount: ingredient.amount * factor, id: `${ingredient.name}-${ingredient.unit}`, checked: false }) }); return next }); setSelected(null); flash('Ingredientes adicionados à sua lista de compras.') }
  if (!account) return <AuthPage onAuthenticated={setAccount} />

  return <main><header className="topbar"><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><nav aria-label="Navegação principal"><a className="active" href="#receitas">Receitas</a><a href="#planejar">Planejar</a><a href="#lista">Lista <b className="list-count">{list.length}</b></a></nav><button className="profile" onClick={() => { signOut(); setAccount(null) }} aria-label="Sair da conta" title="Sair da conta">{account.name.slice(0, 2).toUpperCase()}</button></header>
    <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow">OLÁ, {account.name.toUpperCase()}</p><h1>Receitas que dão vontade de voltar para a cozinha.</h1><p className="hero-text">Descubra ideias acolhedoras para todos os dias e monte sua próxima lista de compras em poucos toques.</p><div className="hero-actions"><a className="button primary" href="#receitas">Explorar receitas <span>→</span></a><a className="button quiet" href="#planejar">Planejar semana <span>↗</span></a></div></div><div className="hero-art"><img src="/images/hero-bowl.png" alt="Bowl de legumes assados em uma mesa clara" /></div></section>
    <section className="explore" id="receitas"><div className="section-heading"><div><p className="eyebrow">COMECE POR AQUI</p><h2>Feitas para a sua semana</h2></div></div><div className="filters" aria-label="Categorias de receita">{categories.map((filter) => <button key={filter} className={category === filter ? 'selected' : ''} onClick={() => setCategory(filter)}>{filter}</button>)}</div><div className="advanced-filters"><label>Tempo<select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}><option>Qualquer tempo</option><option>Até 20 min</option><option>Até 30 min</option></select></label><label>Dificuldade<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Todas</option><option>Fácil</option><option>Média</option></select></label></div><div className="recipe-grid">{visible.map((recipe) => <article className={`recipe-card ${recipe.featured ? 'large' : ''}`} key={recipe.id}><div className="recipe-image"><img src={recipe.image} alt={recipe.alt} /><button className={saved.includes(recipe.id) ? 'heart saved' : 'heart'} onClick={() => setSaved((items) => items.includes(recipe.id) ? items.filter((id) => id !== recipe.id) : [...items, recipe.id])} aria-label={`${saved.includes(recipe.id) ? 'Remover' : 'Salvar'} ${recipe.title}`}>{saved.includes(recipe.id) ? '♥' : '♡'}</button></div><div className="recipe-copy"><div className="recipe-meta"><span>{recipe.time}</span><span>•</span><span>{recipe.difficulty}</span></div><h3>{recipe.title}</h3><p>{recipe.description}</p><button className="recipe-link" onClick={() => { setSelected(recipe); setServings(recipe.servings) }}>Ver receita <span>→</span></button></div></article>)}</div>{visible.length === 0 && <p className="no-results">Nenhuma receita encontrada com esses filtros.</p>}</section>
    <section className="recipe-search" aria-labelledby="search-title">
      <div><p className="eyebrow">ENCONTRE UMA IDEIA</p><h2 id="search-title">O que você quer cozinhar?</h2><p>Busque pelo nome, ingrediente ou tipo de receita.</p></div>
      <div className="search-control" role="search"><label className="sr-only" htmlFor="recipe-search">Buscar receitas</label><input id="recipe-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: banana, frango ou jantar" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca">Limpar</button>}</div>
      <p className="search-summary" aria-live="polite">{visible.length === 1 ? '1 receita encontrada.' : `${visible.length} receitas encontradas.`}</p>
    </section>
    <RecipeCreator onAdd={addUserRecipe} />
    <WeeklyPlanner recipes={allRecipes} plan={plan} onAdd={addPlan} onRemove={(id) => setPlan((entries) => entries.filter((entry) => entry.id !== id))} />
    <MarketBag items={list} onToggle={(id) => setList((items) => items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item))} onRemove={(id) => setList((items) => items.filter((item) => item.id !== id))} onClear={() => setList([])} />
    <footer><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><span>Seu cantinho para cozinhar com calma.</span><span>Dia 3 de 5</span></footer>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-title" onMouseDown={(event) => event.stopPropagation()}><button ref={closeButtonRef} className="close-modal" onClick={() => setSelected(null)} aria-label="Fechar receita">×</button><img className="modal-image" src={selected.image} alt={selected.alt} /><div className="modal-content"><div className="recipe-meta"><span>{selected.time}</span><span>•</span><span>{selected.category}</span></div><h2 id="recipe-title">{selected.title}</h2><p className="modal-description">{selected.description}</p><div className="servings"><div><b>Porções</b><span>ajuste antes de adicionar</span></div><div className="serving-control"><button onClick={() => setServings((value) => Math.max(1, value - 1))} aria-label="Diminuir porções">−</button><strong>{servings}</strong><button onClick={() => setServings((value) => value + 1)} aria-label="Aumentar porções">+</button></div></div><div className="detail-columns"><div><h3>Ingredientes</h3><ul className="ingredients">{selected.ingredients.map((ingredient) => <li key={ingredient.name}><span>{ingredient.name}</span><b>{displayAmount(ingredient.amount * servings / selected.servings)} {ingredient.unit}</b></li>)}</ul></div><div><h3>Modo de preparo</h3><ol className="steps">{selected.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></div><button className="button primary add-button" onClick={addIngredients}>Adicionar ingredientes à lista <span>→</span></button></div></section></div>}{notice && <div className="toast" role="status">{notice}</div>}</main>
}
