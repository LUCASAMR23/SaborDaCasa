import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'

export type UserRecipeDraft = { title: string; servings: number; image: string; category: string; description: string }

export function RecipeCreator({ onAdd }: { onAdd: (recipe: UserRecipeDraft) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [servings, setServings] = useState(2)
  const [category, setCategory] = useState('Minhas receitas')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const imageInput = useRef<HTMLInputElement>(null)

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => setImage(String(reader.result)))
    reader.readAsDataURL(file)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onAdd({ title: title.trim(), servings, image, category, description: description.trim() || 'Uma receita criada por você para repetir sempre que quiser.' })
    setTitle(''); setServings(2); setCategory('Minhas receitas'); setDescription(''); setImage(''); setOpen(false)
  }

  return <section className="recipe-creator" id="minhas-receitas"><div><p className="eyebrow">DO SEU JEITO</p><h2>Suas receitas têm lugar à mesa.</h2><p>Guarde aquela receita de família ou uma ideia que deu certo. Você escolhe o nome, as porções e a foto.</p></div><button className="button primary" onClick={() => setOpen(true)}>Adicionar receita <span>→</span></button>{open && <div className="creator-backdrop" role="presentation" onMouseDown={() => setOpen(false)}><form className="creator-form" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}><button className="close-modal" type="button" onClick={() => setOpen(false)} aria-label="Fechar formulário">×</button><p className="eyebrow">NOVA RECEITA</p><h2>Adicione sua receita</h2><label>Nome da receita<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Bolo da vó" autoFocus /></label><div className="creator-two-columns"><label>Porções<input type="number" min="1" value={servings} onChange={(event) => setServings(Math.max(1, Number(event.target.value)))} /></label><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Minhas receitas</option><option>Café da manhã</option><option>Almoço</option><option>Jantar</option><option>Sobremesa</option></select></label></div><label>Descrição <span>(opcional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Conte um pouco sobre essa receita" rows={3} /></label><div className="photo-field"><input ref={imageInput} type="file" accept="image/*" onChange={selectImage} /><button className="photo-button" type="button" onClick={() => imageInput.current?.click()}>{image ? 'Trocar foto' : 'Escolher uma foto'}</button>{image && <img src={image} alt="Prévia da receita" />}</div><button className="button primary" type="submit">Salvar receita <span>→</span></button><small>A foto e a receita ficam salvas somente neste navegador.</small></form></div>}</section>
}
