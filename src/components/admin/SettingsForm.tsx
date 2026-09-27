import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SiteSettings } from "@/data/articles"

const FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; hint?: string }[] = [
  { key: "phone", label: "Телефон", placeholder: "+7 (495) 123-45-67" },
  { key: "email", label: "Email", placeholder: "info@legaldome.ru" },
  { key: "address", label: "Адрес офиса", placeholder: "Москва, ул. Тверская, 1" },
  { key: "hours", label: "Часы работы", placeholder: "Пн–Пт 9:00–20:00" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/legaldome", hint: "Полная ссылка. Пустое поле — кнопка не показывается" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/74951234567", hint: "Полная ссылка. Пустое поле — кнопка не показывается" },
  { key: "vk", label: "ВКонтакте", placeholder: "https://vk.com/legaldome", hint: "Полная ссылка. Пустое поле — кнопка не показывается" },
]

export function SettingsForm({
  initial,
  saving,
  onSave,
}: {
  initial: SiteSettings
  saving: boolean
  onSave: (s: SiteSettings) => void
}) {
  const [values, setValues] = useState<SiteSettings>(initial)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-foreground/10 bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              value={values[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
            {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Сохраняем..." : "Сохранить контакты"}
      </Button>
    </form>
  )
}
