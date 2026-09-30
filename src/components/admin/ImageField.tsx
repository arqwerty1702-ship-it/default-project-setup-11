import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { uploadImage } from "./api"

export function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadImage(file))
      toast.success("Картинка загружена")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось загрузить")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>Картинка</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-foreground/15 bg-foreground/5 sm:w-40">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Icon name="Image" size={28} className="text-foreground/30" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
              <Icon name={busy ? "Loader2" : "Upload"} size={16} className={`mr-1.5 ${busy ? "animate-spin" : ""}`} />
              {busy ? "Загружаем..." : value ? "Заменить" : "Загрузить с компьютера"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                Убрать
              </Button>
            )}
          </div>
          <Input value={value} placeholder="или вставьте ссылку на картинку" onChange={(e) => onChange(e.target.value)} />
          <p className="text-xs text-muted-foreground">JPG, PNG или WEBP до 5 МБ. Лучше горизонтальная, 4:3</p>
        </div>
      </div>
    </div>
  )
}
