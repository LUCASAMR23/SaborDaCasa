export type Account = { name: string; email: string; password: string }

const accountKey = 'sabor-da-casa-account'
const sessionKey = 'sabor-da-casa-session'

export function currentAccount(): Account | null {
  try {
    const account = JSON.parse(localStorage.getItem(accountKey) ?? 'null') as Account | null
    return localStorage.getItem(sessionKey) === account?.email ? account : null
  } catch {
    return null
  }
}

export function registerAccount(account: Account) {
  localStorage.setItem(accountKey, JSON.stringify(account))
  localStorage.setItem(sessionKey, account.email)
}

export function signIn(email: string, password: string): Account | null {
  try {
    const account = JSON.parse(localStorage.getItem(accountKey) ?? 'null') as Account | null
    if (account?.email === email.trim().toLowerCase() && account.password === password) {
      localStorage.setItem(sessionKey, account.email)
      return account
    }
  } catch { /* Empty by design: an invalid local record behaves as no account. */ }
  return null
}

export function signOut() { localStorage.removeItem(sessionKey) }
