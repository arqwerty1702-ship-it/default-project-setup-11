import Icon from "@/components/ui/icon"

export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 transition-colors hover:border-primary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
  return (
    <div className="mt-6 flex items-center gap-3">
      <button type="button" className={btn} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Назад">
        <Icon name="ChevronLeft" size={18} />
      </button>
      <span className="font-mono text-xs text-foreground/60">
        {page + 1} / {pages}
      </span>
      <button
        type="button"
        className={btn}
        disabled={page >= pages - 1}
        onClick={() => onChange(page + 1)}
        aria-label="Вперёд"
      >
        <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  )
}
