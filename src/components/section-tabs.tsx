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
    <div className="inline-flex rounded-full border border-foreground/15 bg-foreground/5 p-1 backdrop-blur-md">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            value === t ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
