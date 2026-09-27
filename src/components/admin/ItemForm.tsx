import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import type { ContentType } from "./api"

export type FormItem = Record<string, string | number>

type Field = { key: string; label: string; placeholder?: string; multiline?: number; hint?: string }

const FIELDS: Record<ContentType, Field[]> = {
  articles: [
    { key: "title", label: "Заголовок", placeholder: "Как проверить квартиру перед покупкой" },
    { key: "category", label: "Тема (для фильтра)", placeholder: "Покупка жилья" },
    { key: "date_label", label: "Дата", placeholder: "27 сентября 2026" },
    { key: "read_time", label: "Время чтения", placeholder: "5 мин" },
    { key: "excerpt", label: "Краткое описание", multiline: 2, hint: "Показывается на карточке статьи" },
    { key: "body", label: "Текст статьи", multiline: 12, hint: "Абзацы разделяйте пустой строкой" },
  ],
  cases: [
    { key: "title", label: "Результат", placeholder: "Вернули 4,2 млн ₽ покупателю" },
    { key: "category", label: "Суть дела", placeholder: "Сделка с банкротом · Арбитражный суд" },
    { key: "year", label: "Год", placeholder: "2026" },
  ],
  services: [
    { key: "title", label: "Название услуги", placeholder: "Проверка объекта и сделки" },
    { key: "description", label: "Описание", multiline: 3, placeholder: "Что входит в услугу" },
    { key: "price", label: "Цена", placeholder: "от 15 000 ₽" },
  ],
}

export const SERVICE_ICONS: { name: string; label: string }[] = [
  { name: "FileSearch", label: "Проверка" },
  { name: "Building2", label: "Здание" },
  { name: "Home", label: "Дом" },
  { name: "Trees", label: "Земля" },
  { name: "Scale", label: "Суд" },
  { name: "FileText", label: "Документ" },
  { name: "Handshake", label: "Сделка" },
  { name: "KeyRound", label: "Ключи" },
  { name: "Landmark", label: "Госорган" },
  { name: "ShieldCheck", label: "Защита" },
  { name: "Users", label: "Семья" },
  { name: "Wallet", label: "Деньги" },
]

export const emptyItem = (type: ContentType): FormItem => {
  const item: FormItem = { sort_order: 0 }
  FIELDS[type].forEach((f) => (item[f.key] = ""))
  if (type === "articles") {
    item.date_label = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(" г.", "")
    item.read_time = "5 мин"
  }
  if (type === "cases") item.year = String(new Date().getFullYear())
  if (type === "services") item.icon = "Scale"
  return item
}

export function ItemForm({
  type,
  initial,
  saving,
  onSave,
  onCancel,
}: {
  type: ContentType
  initial: FormItem
  saving: boolean
  onSave: (item: FormItem) => void
  onCancel: () => void
}) {
  const [item, setItem] = useState<FormItem>(initial)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave(item)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {FIELDS[type].map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label htmlFor={f.key}>{f.label}</Label>
          {f.multiline ? (
            <Textarea
              id={f.key}
              rows={f.multiline}
              value={String(item[f.key] ?? "")}
              placeholder={f.placeholder}
              onChange={(e) => setItem({ ...item, [f.key]: e.target.value })}
            />
          ) : (
            <Input
              id={f.key}
              value={String(item[f.key] ?? "")}
              placeholder={f.placeholder}
              onChange={(e) => setItem({ ...item, [f.key]: e.target.value })}
            />
          )}
          {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
        </div>
      ))}
      {type === "services" && (
        <div className="space-y-1.5">
          <Label>Иконка</Label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_ICONS.map((ic) => (
              <button
                key={ic.name}
                type="button"
                title={ic.label}
                onClick={() => setItem({ ...item, icon: ic.name })}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  item.icon === ic.name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
                }`}
              >
                <Icon name={ic.name} size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="sort_order">Приоритет показа</Label>
        <Input
          id="sort_order"
          type="number"
          className="w-32"
          value={item.sort_order}
          onChange={(e) => setItem({ ...item, sort_order: Number(e.target.value) })}
        />
        <p className="text-xs text-muted-foreground">Чем больше число, тем выше в списке. При равенстве — новые сверху</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving || !String(item.title).trim()}>
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
