import { useState } from "react"
import Icon from "@/components/ui/icon"

export function MobileMenu({
  items,
  cta,
  onSelect,
  onCta,
}: {
  items: string[]
  cta: string
  onSelect: (index: number) => void
  onCta: () => void
}) {
  const [open, setOpen] = useState(false)

  const go = (fn: () => void) => {
    setOpen(false)
    setTimeout(fn, 50)
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground"
      >
        <Icon name={open ? "X" : "Menu"} size={20} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-foreground/10 bg-background/95 px-4 pb-5 pt-2 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col">
            {items.map((label, i) => (
              <button
                key={label + i}
                type="button"
                onClick={() => go(() => onSelect(i))}
                className="border-b border-foreground/10 py-3.5 text-left text-lg text-foreground"
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => go(onCta)}
            className="mt-4 w-full rounded-full bg-primary py-3 text-base font-medium text-primary-foreground"
          >
            {cta}
          </button>
        </div>
      )}
    </div>
  )
}
