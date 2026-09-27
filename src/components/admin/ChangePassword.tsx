import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { adminRequest, setPassword } from "./api"

export function ChangePassword({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [next, setNext] = useState("")
  const [repeat, setRepeat] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    const value = next.trim()
    if (value.length < 8) return setError("Не короче 8 символов")
    if (value !== repeat.trim()) return setError("Пароли не совпадают")
    setSaving(true)
    try {
      await adminRequest("POST", { type: "cases", action: "change_password", new_password: value })
      setPassword(value)
      toast.success("Пароль изменён")
      setNext("")
      setRepeat("")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Сменить пароль</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="np">Новый пароль</Label>
            <Input id="np" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="np2">Повторите пароль</Label>
            <Input id="np2" type="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Сохраняем..." : "Сохранить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
