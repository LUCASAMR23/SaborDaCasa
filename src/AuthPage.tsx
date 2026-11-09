import { useState, type FormEvent } from 'react'
import { registerAccount, signIn, type Account } from './auth'

export function AuthPage({ onAuthenticated }: { onAuthenticated: (account: Account) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim().toLowerCase()
    if (mode === 'register') {
      if (name.trim().length < 2) return setError('Informe seu nome para criar a conta.')
      if (password.length < 4) return setError('Use uma senha com pelo menos 4 caracteres.')
      const account = { name: name.trim(), email: normalizedEmail, password }
      registerAccount(account)
      onAuthenticated(account)
      return
    }
    const account = signIn(normalizedEmail, password)
    if (!account) return setError('E-mail ou senha não conferem. Crie uma conta caso seja seu primeiro acesso.')
    onAuthenticated(account)
  }

  return <main className="auth-page"><section className="auth-card"><a className="brand" href="#inicio"><span>✦</span> Sabor da Casa</a><p className="eyebrow">SEU CANTINHO NA COZINHA</p><h1>{mode === 'login' ? 'Que bom ter você de volta.' : 'Crie sua conta gratuita.'}</h1><p className="auth-copy">{mode === 'login' ? 'Entre para acessar suas receitas, lista e planejamento.' : 'Guarde suas receitas e organize a semana com mais leveza.'}</p><div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError('') }}>Entrar</button><button className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setError('') }}>Criar conta</button></div><form onSubmit={submit} className="auth-form">{mode === 'register' && <label>Nome<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>}<label>E-mail<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label><label>Senha<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="button primary" type="submit">{mode === 'login' ? 'Entrar na minha conta' : 'Criar minha conta'} <span>→</span></button></form><small>Dados salvos somente neste navegador nesta versão de demonstração.</small></section><aside className="auth-image"><div><span>✦</span><p>Receitas, planos e listas no seu ritmo.</p></div></aside></main>
}
