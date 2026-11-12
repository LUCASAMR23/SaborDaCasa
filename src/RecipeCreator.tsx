import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'

export type RecipeIngredientDraft = { name: string; amount: number; unit: string }
export type UserRecipeDraft = {
  title: string; servings: number; image: string; category: string; description: string; minutes: number
  difficulty: 'Fácil' | 'Média'; ingredients: RecipeIngredientDraft[]; steps: string[]
}

const emptyIngredient = (): RecipeIngredientDraft => ({ name: '', amount: 1, unit: 'un.' })

export function RecipeCreator({ onAdd }: { onAdd: (recipe: UserRecipeDraft) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [servings, setServings] = useState(2)
  const [category, setCategory] = useState('Minhas receitas')
  const [description, setDescription] = useState('')
  const [minutes, setMinutes] = useState(30)
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Média'>('Fácil')
  const [image, setImage] = useState('')
  const [ingredients, setIngredients] = useState<RecipeIngredientDraft[]>([emptyIngredient()])
  const [steps, setSteps] = useState([''])
  const imageInput = useRef<HTMLInputElement>(null)

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => setImage(String(reader.result)))
    reader.readAsDataURL(file)
  }

  function resetForm() {
    setTitle(''); setServings(2); setCategory('Minhas receitas'); setDescription(''); setMinutes(30); setDifficulty('Fácil'); setImage(''); setIngredients([emptyIngredient()]); setSteps([''])
  }

  function updateIngredient(index: number, field: keyof RecipeIngredientDraft, value: string | number) {
    setIngredients((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  function updateStep(index: number, value: string) {
    setSteps((items) => items.map((item, itemIndex) => itemIndex === index ? value : item))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanIngredients = ingredients.filter((ingredient) => ingredient.name.trim()).map((ingredient) => ({ ...ingredient, name: ingredient.name.trim(), amount: Math.max(0.1, ingredient.amount || 1), unit: ingredient.unit.trim() || 'un.' }))
    const cleanSteps = steps.map((step) => step.trim()).filter(Boolean)
    onAdd({ title: title.trim(), servings, image, category, description: description.trim() || 'Uma receita criada por você para repetir sempre que quiser.', minutes, difficulty, ingredients: cleanIngredients, steps: cleanSteps.length ? cleanSteps : ['Adicione o preparo quando quiser atualizar esta receita.'] })
    resetForm(); setOpen(false)
  }

  return <section className="recipe-creator" id="minhas-receitas"><div><p className="eyebrow">DO SEU JEITO</p><h2>Da memória para a sua cozinha.</h2><p>Crie uma ficha completa para aquela receita de família — e transforme ingredientes em uma lista de mercado pronta para usar.</p></div><button className="button primary" onClick={() => setOpen(true)}>Criar receita completa <span>→</span></button>{open && <div className="creator-backdrop" role="presentation" onMouseDown={() => { resetForm(); setOpen(false) }}><form className="creator-form" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}><button className="close-modal" type="button" onClick={() => { resetForm(); setOpen(false) }} aria-label="Fechar formulário">×</button><p className="eyebrow">SEU CADERNO DIGITAL</p><h2>Nova receita</h2><p className="creator-intro">Monte o essencial agora. A sacola de mercado calcula as quantidades conforme as porções.</p><label>Nome da receita<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Bolo da vó" autoFocus /></label><div className="creator-two-columns"><label>Porções<input type="number" min="1" value={servings} onChange={(event) => setServings(Math.max(1, Number(event.target.value)))} /></label><label>Tempo em minutos<input type="number" min="1" value={minutes} onChange={(event) => setMinutes(Math.max(1, Number(event.target.value)))} /></label><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Minhas receitas</option><option>Café da manhã</option><option>Almoço</option><option>Jantar</option><option>Sobremesa</option></select></label><label>Dificuldade<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as 'Fácil' | 'Média')}><option>Fácil</option><option>Média</option></select></label></div><label>Descrição <span>(opcional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="O que torna essa receita especial?" rows={3} /></label><fieldset className="recipe-builder"><legend>Ingredientes</legend>{ingredients.map((ingredient, index) => <div className="ingredient-row" key={index}><input required={index === 0} value={ingredient.name} onChange={(event) => updateIngredient(index, 'name', event.target.value)} placeholder="Ingrediente" /><input aria-label={`Quantidade do ingrediente ${index + 1}`} type="number" min="0.1" step="0.1" value={ingredient.amount} onChange={(event) => updateIngredient(index, 'amount', Number(event.target.value))} /><input aria-label={`Unidade do ingrediente ${index + 1}`} value={ingredient.unit} onChange={(event) => updateIngredient(index, 'unit', event.target.value)} placeholder="un." />{ingredients.length > 1 && <button type="button" onClick={() => setIngredients((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remover ingrediente">×</button>}</div>)}<button className="add-row" type="button" onClick={() => setIngredients((items) => [...items, emptyIngredient()])}>+ Adicionar ingrediente</button></fieldset><fieldset className="recipe-builder"><legend>Preparo</legend>{steps.map((step, index) => <div className="step-row" key={index}><span>{index + 1}</span><input required={index === 0} value={step} onChange={(event) => updateStep(index, event.target.value)} placeholder="Descreva esta etapa" />{steps.length > 1 && <button type="button" onClick={() => setSteps((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remover etapa">×</button>}</div>)}<button className="add-row" type="button" onClick={() => setSteps((items) => [...items, ''])}>+ Adicionar etapa</button></fieldset><div className="photo-field"><input ref={imageInput} type="file" accept="image/*" onChange={selectImage} /><button className="photo-button" type="button" onClick={() => imageInput.current?.click()}>{image ? 'Trocar foto' : 'Escolher uma foto'}</button>{image && <img src={image} alt="Prévia da receita" />}</div><button className="button primary" type="submit">Salvar e levar para a sacola <span>→</span></button><small>A receita e a foto ficam salvas somente neste navegador.</small></form></div>}</section>
}
