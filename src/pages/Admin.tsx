import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Icon from "@/components/ui/icon"
import { SectionTabs } from "@/components/section-tabs"
import { AdminLogin } from "@/components/admin/AdminLogin"
import { ItemForm, emptyItem, type FormItem } from "@/components/admin/ItemForm"
import { adminRequest, clearPassword, getPassword, type ContentType } from "@/components/admin/api"
import { useContent } from "@/data/articles"

const TABS = ["Статьи", "Практика"] as const
const TYPE: Record<(typeof TABS)[number], ContentType> = { Статьи: "articles", Практика: "cases" }

export default function Admin() {
  const [authed, setAuthed] = useState(!!getPassword())
  const [tab, setTab] = useState<(typeof TABS)[number]>("Статьи")
  const [editing, setEditing] = useState<FormItem | null>(null)
  const [removing, setRemoving] = useState<{ id: number; title: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const { data, isLoading } = useContent()
  const qc = useQueryClient()
  const type = TYPE[tab]

  if (!authed) return <Wrapper><AdminLogin onSuccess={() => setAuthed(true)} /></Wrapper>

  const run = async (method: "POST" | "PUT" | "DELETE", body: Record<string, unknown>, msg: string) => {
    setSaving(true)
    try {
      const res = await adminRequest(method, { type, ...body })
      qc.setQueryData(["content"], { articles: res.articles, cases: res.cases })
      toast.success(msg)
      return true
    } catch (e) {
      const text = e instanceof Error ? e.message : "Ошибка"
      toast.error(text)
      if (text === "Неверный пароль") {
        clearPassword()
        setAuthed(false)
      }
      return false
    } finally {
      setSaving(false)
    }
  }

  const save = async (item: FormItem) => {
    const ok = item.id
      ? await run("PUT", { id: item.id, item }, "Изменения сохранены")
      : await run("POST", { item }, "Добавлено на сайт")
    if (ok) setEditing(null)
  }

  const items = type === "articles" ? data?.articles ?? [] : data?.cases ?? []

  return (
    <Wrapper>
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="" className="h-9 w-9" />
            <div className="leading-tight">
              <div className="font-serif text-xl text-foreground">Legal Dome</div>
              <div className="text-xs text-muted-foreground">Админ-панель</div>
            </div>
          </a>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <Icon name="ExternalLink" size={16} className="mr-1.5" />
                Сайт
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearPassword()
                setAuthed(false)
              }}
            >
              <Icon name="LogOut" size={16} className="mr-1.5" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <SectionTabs tabs={TABS} value={tab} onChange={setTab} />
          <Button onClick={() => setEditing(emptyItem(type))}>
            <Icon name="Plus" size={18} className="mr-1.5" />
            {type === "articles" ? "Новая статья" : "Новое дело"}
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 p-10 text-center text-muted-foreground">
            Пока пусто — добавьте первую запись
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-foreground/10 bg-card p-4"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{it.title}</div>
                  <div className="truncate text-sm text-muted-foreground">
                    {"date_label" in it ? `${it.category} · ${it.date_label}` : `${it.category} · ${it.year}`}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing({ ...it })} aria-label="Редактировать">
                    <Icon name="Pencil" size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRemoving({ id: it.id, title: it.title })}
                    aria-label="Удалить"
                  >
                    <Icon name="Trash2" size={18} className="text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Редактирование" : type === "articles" ? "Новая статья" : "Новое дело"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <ItemForm
              key={String(editing.id ?? "new")}
              type={type}
              initial={editing}
              saving={saving}
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
            <AlertDialogDescription>«{removing?.title}» исчезнет с сайта. Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={async () => {
                if (removing) await run("DELETE", { id: removing.id }, "Удалено")
                setRemoving(null)
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-y-auto bg-background text-foreground">{children}</div>
}
