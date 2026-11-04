import { useState } from 'react'

type Recipe = {
  id: number
  title: string
  description: string
  time: string
  servings: string
  category: string
  image: string
  alt: string
  featured?: boolean
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Bowl de legumes assados',
    description: 'Cremoso, colorido e pronto para entrar na sua rotina.',
    time: '35 min',
    servings: '2 porções',
    category: 'Vegetariana',
    image: '/images/hero-bowl.png',
    alt: 'Bowl com legumes assados e ervas frescas',
    featured: true,
  },
  {
    id: 2,
    title: 'Massa cremosa de limão',
    description: 'Uma receita leve para um jantar que parece especial.',
    time: '25 min',
    servings: '2 porções',
    category: 'Jantar',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85',
    alt: 'Prato de massa cremosa com ervas',
  },
  {
    id: 3,
    title: 'Panquecas de banana',
    description: 'Café da manhã macio, dourado e cheio de sabor.',
    time: '15 min',
    servings: '6 unidades',
    category: 'Café da manhã',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85',
    alt: 'Panquecas empilhadas com banana e frutas',
  },
]

const filters = ['Tudo', 'Rápidas', 'Vegetariana', 'Jantar', 'Café da manhã']

export default function App() {
  const [activeFilter, setActiveFilter] = useState('Tudo')
  const [saved, setSaved] = useState<number[]>([])
  const [notice, setNotice] = useState('')

  const visibleRecipes = recipes.filter((recipe) =>
    activeFilter === 'Tudo' || activeFilter === 'Rápidas' ? true : recipe.category === activeFilter,
  )

  function toggleSave(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function showSoon() {
    setNotice('A lista de compras entra no Dia 2. Hoje estamos fechando a base visual.')
    window.setTimeout(() => setNotice(''), 3400)
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Sabor da Casa, início"><span>✦</span> Sabor da Casa</a>
        <nav aria-label="Navegação principal">
          <a className="active" href="#receitas">Receitas</a>
          <a href="#planejar">Planejar</a>
          <a href="#favoritas">Favoritas</a>
        </nav>
        <button className="profile" aria-label="Abrir perfil">LM</button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">COMER BEM, SEM COMPLICAR</p>
          <h1>Receitas que dão vontade de voltar para a cozinha.</h1>
          <p className="hero-text">Descubra ideias acolhedoras para todos os dias e monte sua próxima lista de compras em poucos toques.</p>
          <div className="hero-actions">
            <a className="button primary" href="#receitas">Explorar receitas <span>→</span></a>
            <button className="button quiet" onClick={showSoon}>Como funciona <span>↗</span></button>
          </div>
          <div className="social-proof"><div className="avatars"><i>J</i><i>M</i><i>A</i></div><span>Mais de <strong>12 mil</strong> pessoas já cozinham com a gente.</span></div>
        </div>
        <div className="hero-art"><img src="/images/hero-bowl.png" alt="Bowl de legumes assados em uma mesa clara" /><div className="hero-note"><b>✦ 25 min</b><span>simples, bonito e gostoso</span></div></div>
      </section>

      <section className="explore" id="receitas">
        <div className="section-heading"><div><p className="eyebrow">COMECE POR AQUI</p><h2>Feitas para a sua semana</h2></div><a href="#todas">Ver todas <span>→</span></a></div>
        <div className="filters" aria-label="Filtros de receita">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'selected' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <div className="recipe-grid">
          {visibleRecipes.map((recipe) => <article className={`recipe-card ${recipe.featured ? 'large' : ''}`} key={recipe.id}>
            <div className="recipe-image"><img src={recipe.image} alt={recipe.alt} /><button className={saved.includes(recipe.id) ? 'heart saved' : 'heart'} onClick={() => toggleSave(recipe.id)} aria-label="Salvar receita">{saved.includes(recipe.id) ? '♥' : '♡'}</button>{recipe.featured && <span className="tag">Favorita da semana</span>}</div>
            <div className="recipe-copy"><div className="recipe-meta"><span>{recipe.time}</span><span>•</span><span>{recipe.servings}</span></div><h3>{recipe.title}</h3><p>{recipe.description}</p><button className="recipe-link" onClick={showSoon}>Ver receita <span>→</span></button></div>
          </article>)}
        </div>
      </section>

      <section className="planner" id="planejar"><div><p className="eyebrow">SEU PRÓXIMO PASSO</p><h2>Planeje a semana sem abrir dez abas.</h2><p>Salve receitas, ajuste as porções e leve uma lista de compras organizada para o mercado.</p><button className="button primary" onClick={showSoon}>Criar meu planejamento <span>→</span></button></div><div className="list-preview"><div className="list-top"><span>Lista de compras</span><b>3 receitas</b></div><label><input type="checkbox" defaultChecked /> 2 abobrinhas</label><label><input type="checkbox" /> 1 pote de iogurte</label><label><input type="checkbox" /> Ervas frescas</label><small>Estimativa de preço disponível no Dia 3</small></div></section>

      <footer><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><span>Seu cantinho para cozinhar com calma.</span><span>Dia 1 de 5</span></footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  )
}

