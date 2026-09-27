import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
}

export const emptyItem = (type: ContentType): FormItem => {
  const item: FormItem = { sort_order: 0 }
  FIELDS[type].forEach((f) => (item[f.key] = ""))
  if (type === "articles") {
    item.date_label = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(" г.", "")
    item.read_time = "5 мин"
  }
  if (type === "cases") item.year = String(new Date().getFullYear())
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
