export type PricedIngredient = { name: string; amount: number; unit: string }

const referencePrices: Record<string, number> = {
  abobrinha: 3.5,
  cenoura: 1.25,
  'grão-de-bico cozido': 4.5,
  'iogurte natural': 3.25,
  azeite: 1.1,
  'ervas frescas': 3,
  'massa curta': 0.016,
  limão: 1.2,
  'banana madura': 1.1,
  ovo: 1.15,
  'aveia em flocos': 4.5,
  canela: 0.65,
}

export function estimateIngredient(item: PricedIngredient): number | null {
  const price = referencePrices[item.name]
  return price === undefined ? null : price * item.amount
}

export function estimateList(items: PricedIngredient[]) {
  return items.reduce(
    (summary, item) => {
      const estimate = estimateIngredient(item)
      if (estimate === null) summary.withoutReference += 1
      else summary.total += estimate
      return summary
    },
    { total: 0, withoutReference: 0 },
  )
}

export const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
