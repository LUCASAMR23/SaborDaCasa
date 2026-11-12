import { PriceSummary } from './PriceSummary'

export type MarketItem = { id: string; name: string; amount: number; unit: string; checked: boolean }

type Props = { items: MarketItem[]; onToggle: (id: string) => void; onRemove: (id: string) => void; onClear: () => void }

const aisleRules: Array<[string, string[]]> = [
  ['Hortifruti', ['abobrinha', 'cenoura', 'limão', 'tomate', 'banana', 'ervas']],
  ['Geladeira', ['iogurte', 'ricota', 'ovo']],
  ['Proteínas', ['frango']],
]

const aisleFor = (name: string) => aisleRules.find(([, terms]) => terms.some((term) => name.toLocaleLowerCase('pt-BR').includes(term)))?.[0] ?? 'Despensa'
const displayAmount = (amount: number) => Number.isInteger(amount) ? String(amount) : amount.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

export function MarketBag({ items, onToggle, onRemove, onClear }: Props) {
  const checked = items.filter((item) => item.checked).length
  const progress = items.length ? Math.round(checked / items.length * 100) : 0
  const groups = items.reduce<Record<string, MarketItem[]>>((result, item) => {
    const aisle = aisleFor(item.name)
    result[aisle] = [...(result[aisle] ?? []), item]
    return result
  }, {})

  return <section className="market-bag" id="lista" aria-labelledby="market-bag-title">
    <div className="bag-heading"><div><p className="eyebrow">PRONTA PARA O MERCADO</p><h2 id="market-bag-title">Sua sacola inteligente</h2><p>Organizamos os itens por setor para você passar menos tempo procurando e mais tempo cozinhando.</p></div>{items.length > 0 && <button className="clear-list" onClick={onClear}>Esvaziar sacola</button>}</div>
    {items.length ? <><div className="bag-progress"><div className="bag-progress-copy"><span>Rota de compra</span><strong>{checked} de {items.length} itens na sacola</strong></div><div className="progress-track" aria-label={`${progress}% dos itens separados`}><span style={{ width: `${progress}%` }} /></div><b>{progress}%</b></div><div className="bag-groups">{Object.entries(groups).map(([aisle, groupItems]) => <article className="bag-group" key={aisle}><h3><span aria-hidden="true">⌁</span>{aisle}<small>{groupItems.filter((item) => item.checked).length}/{groupItems.length}</small></h3><ul>{groupItems.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.checked} onChange={() => onToggle(item.id)} /><span className={item.checked ? 'done' : ''}>{item.name}</span></label><span>{displayAmount(item.amount)} {item.unit}</span><button onClick={() => onRemove(item.id)} aria-label={`Remover ${item.name} da sacola`}>×</button></li>)}</ul></article>)}</div><PriceSummary items={items} /></> : <div className="bag-empty"><span aria-hidden="true">⌁</span><h3>A sacola está leve por enquanto.</h3><p>Abra uma receita e leve os ingredientes para uma compra organizada por setor.</p><a className="button primary" href="#receitas">Explorar receitas <span>→</span></a></div>}
  </section>
}
