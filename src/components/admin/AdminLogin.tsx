import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"
import { adminRequest, setPassword } from "./api"

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await adminRequest("POST", { type: "cases", action: "check" }, value.trim())
      setPassword(value.trim())
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-card p-8">
        <img src="/logo-mark.png" alt="Legal Dome" className="mx-auto mb-4 h-16 w-16" />
        <h1 className="mb-1 text-center font-serif text-3xl text-foreground">Админ-панель</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">Legal Dome</p>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="Пароль"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            autoFocus
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          >
            <Icon name={show ? "EyeOff" : "Eye"} size={18} />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Вводите на английской раскладке, с учётом заглавных букв</p>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <Button type="submit" className="mt-4 w-full" disabled={loading || !value}>
          {loading ? "Проверяем..." : "Войти"}
        </Button>
      </form>
    </div>
  )
}
