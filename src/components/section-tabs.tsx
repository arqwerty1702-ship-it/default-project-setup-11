export function SectionTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-foreground/15 bg-foreground/5 p-1 backdrop-blur-md [scrollbar-width:none]">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all md:px-5 ${
            value === t ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}