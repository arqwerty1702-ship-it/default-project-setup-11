import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"
import func2url from "../../../backend/func2url.json"
import { getPassword } from "./api"

const LEADS_URL = (func2url as Record<string, string>).leads

type Lead = {
  id: number
  name: string
  phone: string
  topic: string
  message: string
  status: "new" | "in_work" | "done" | "spam"
  note: string
  email_sent: boolean
  created_at: string
}

const STATUS: Record<Lead["status"], { label: string; cls: string }> = {
  new: { label: "Новая", cls: "bg-primary text-primary-foreground" },
  in_work: { label: "В работе", cls: "bg-amber-500/20 text-amber-300" },
  done: { label: "Закрыта", cls: "bg-foreground/10 text-foreground/60" },
  spam: { label: "Спам", cls: "bg-red-500/15 text-red-300" },
}

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "in_work", label: "В работе" },
  { key: "done", label: "Закрытые" },
  { key: "spam", label: "Спам" },
] as const

const formatDate = (s: string) =>
  new Date(s.replace(" ", "T") + (s.includes("Z") || s.includes("+") ? "" : "Z")).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

export function LeadsTab({
  leadsEmail,
  savingEmail,
  onSaveEmail,
  onUnauthorized,
}: {
  leadsEmail: string
  savingEmail: boolean
  onSaveEmail: (email: string) => void
  onUnauthorized: () => void
}) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [emailReady, setEmailReady] = useState(true)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all")
  const [open, setOpen] = useState<number | null>(null)
  const [email, setEmail] = useState(leadsEmail)

  const call = useCallback(
    async (method: "POST" | "PUT" | "DELETE", body: Record<string, unknown> = {}) => {
      const res = await fetch(LEADS_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", ...body, password: getPassword() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        onUnauthorized()
        return
      }
      if (!res.ok) throw new Error(data.error || "Ошибка")
      setLeads(data.leads)
      setEmailReady(data.email_configured)
    },
    [onUnauthorized],
  )

  useEffect(() => {
    call("POST")
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [call])

  const update = (id: number, patch: Partial<Pick<Lead, "status" | "note">>, msg?: string) =>
    call("PUT", { id, ...patch })
      .then(() => msg && toast.success(msg))
      .catch((e) => toast.error(e.message))

  const list = filter === "all" ? leads.filter((l) => l.status !== "spam") : leads.filter((l) => l.status === filter)
  const newCount = leads.filter((l) => l.status === "new").length

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-foreground/10 bg-card p-5">
        <form
          className="flex flex-col gap-3 md:flex-row md:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            onSaveEmail(email)
          }}
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="leads_email">Почта для уведомлений о заявках</Label>
            <Input
              id="leads_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="legal-dome@mail.ru"
            />
            <p className="text-xs text-muted-foreground">Можно несколько адресов через запятую</p>
          </div>
          <Button type="submit" variant="outline" disabled={savingEmail}>
            Сохранить
          </Button>
        </form>
        {!emailReady && (
          <p className="mt-3 flex items-start gap-2 text-sm text-amber-300">
            <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0" />
            Отправка писем пока не подключена — заявки сохраняются только здесь.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
            }`}
          >
            {f.label}
            {f.key === "new" && newCount > 0 && ` · ${newCount}`}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => call("POST").then(() => toast.success("Обновлено")).catch((e) => toast.error(e.message))}
        >
          <Icon name="RefreshCw" size={16} className="mr-1.5" />
          Обновить
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 p-10 text-center text-muted-foreground">
          Заявок пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((l) => (
            <div key={l.id} className="rounded-xl border border-foreground/10 bg-card">
              <button
                type="button"
                onClick={() => {
                  setOpen(open === l.id ? null : l.id)
                  if (l.status === "new") update(l.id, { status: "in_work" })
                }}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{l.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS[l.status].cls}`}>
                      {STATUS[l.status].label}
                    </span>
                    {l.topic && <span className="text-xs text-muted-foreground">· {l.topic}</span>}
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {l.phone} · {formatDate(l.created_at)}
                  </div>
                </div>
                <Icon name={open === l.id ? "ChevronUp" : "ChevronDown"} size={18} className="shrink-0" />
              </button>
              {open === l.id && (
                <LeadDetails lead={l} onUpdate={update} onDelete={() => call("DELETE", { id: l.id })} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LeadDetails({
  lead,
  onUpdate,
  onDelete,
}: {
  lead: Lead
  onUpdate: (id: number, patch: Partial<Pick<Lead, "status" | "note">>, msg?: string) => void
  onDelete: () => void
}) {
  const [note, setNote] = useState(lead.note)
  return (
    <div className="space-y-4 border-t border-foreground/10 p-4">
      <p className="whitespace-pre-wrap text-sm text-foreground/90">{lead.message || "Без описания"}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
            <Icon name="Phone" size={16} className="mr-1.5" />
            Позвонить
          </a>
        </Button>
        {(Object.keys(STATUS) as Lead["status"][])
          .filter((s) => s !== lead.status)
          .map((s) => (
            <Button key={s} size="sm" variant="outline" onClick={() => onUpdate(lead.id, { status: s }, "Статус изменён")}>
              {STATUS[s].label}
            </Button>
          ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`note-${lead.id}`}>Заметка</Label>
        <Textarea
          id={`note-${lead.id}`}
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Например: перезвонить в понедельник"
        />
        <div className="flex justify-between">
          <Button size="sm" variant="outline" onClick={() => onUpdate(lead.id, { note }, "Заметка сохранена")}>
            Сохранить заметку
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400"
            onClick={() => confirm("Удалить заявку навсегда?") && onDelete()}
          >
            <Icon name="Trash2" size={16} className="mr-1.5" />
            Удалить
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {lead.email_sent ? "Уведомление отправлено на почту" : "Письмо не отправлялось"}
      </p>
    </div>
  )
}
