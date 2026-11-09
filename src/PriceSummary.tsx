import { estimateList, formatCurrency } from './pricing'

type Item = { name: string; amount: number; unit: string }

export function PriceSummary({ items }: { items: Item[] }) {
  const estimate = estimateList(items)

  return <aside className="price-summary" aria-label="Estimativa de preço da lista">
    <div>
      <p className="eyebrow">ESTIMATIVA DA LISTA</p>
      <h3>{formatCurrency(estimate.total)}</h3>
    </div>
    <p>Valores de referência, não são preços em tempo real e podem variar conforme região e mercado.</p>
    {estimate.withoutReference > 0 && <small>{estimate.withoutReference} {estimate.withoutReference === 1 ? 'item sem' : 'itens sem'} preço de referência.</small>}
  </aside>
}
