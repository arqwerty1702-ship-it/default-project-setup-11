import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TEXT_GROUPS, TEXT_DEFAULTS } from "@/data/texts"

export function TextsForm({
  initial,
  saving,
  onSave,
}: {
  initial: Record<string, string | undefined>
  saving: boolean
  onSave: (v: Record<string, string>) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.keys(TEXT_DEFAULTS).map((k) => [k, initial[k]?.trim() ? initial[k]! : TEXT_DEFAULTS[k]])),
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Раскройте нужный блок, поправьте текст и нажмите «Сохранить». Если очистить поле, вернётся исходный текст.
      </p>
      <Accordion type="multiple" className="rounded-2xl border border-foreground/10 bg-card px-5">
        {TEXT_GROUPS.map((g) => (
          <AccordionItem key={g.title} value={g.title}>
            <AccordionTrigger className="text-base">{g.title}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pb-2 md:grid-cols-2">
                {g.fields.map((f) => (
                  <div key={f.key} className={`space-y-1.5 ${f.rows ? "md:col-span-2" : ""}`}>
                    <Label htmlFor={f.key}>{f.label}</Label>
                    {f.rows ? (
                      <Textarea
                        id={f.key}
                        rows={f.rows}
                        value={values[f.key]}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    ) : (
                      <Input
                        id={f.key}
                        value={values[f.key]}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    )}
                    {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="sticky bottom-4">
        <Button type="submit" disabled={saving} className="shadow-lg">
          {saving ? "Сохраняем..." : "Сохранить тексты"}
        </Button>
      </div>
    </form>
  )
}
