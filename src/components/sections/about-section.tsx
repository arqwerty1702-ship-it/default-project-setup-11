import { useTexts } from "@/data/texts"
import { AccentText } from "@/components/rich-text"

export function AboutContent({ onConsult }: { onConsult?: () => void }) {
  const t = useTexts()
  const stats = [1, 2, 3]
    .map((n) => ({ value: t(`stat${n}_value`), label: t(`stat${n}_label`), sublabel: t(`stat${n}_sub`) }))
    .filter((s) => s.value.trim())
  const paragraphs = t("about_text").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 md:grid-cols-2 md:gap-16 lg:gap-24">
      <div>
        <h2 className="mb-4 font-serif text-4xl font-medium leading-[1.0] tracking-tight text-foreground md:mb-8 md:text-6xl lg:text-7xl">
          <AccentText text={t("about_title")} />
        </h2>
        <div className="space-y-3 md:space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="max-w-md whitespace-pre-line text-sm leading-relaxed text-foreground/90 md:text-lg">
              {p}
            </p>
          ))}
        </div>
        {onConsult && (
          <button
            type="button"
            onClick={onConsult}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:mt-8"
          >
            {t("about_button")}
          </button>
        )}
      </div>

      <div className="flex flex-col justify-center space-y-6 md:space-y-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-baseline gap-4 border-l border-foreground/30 pl-4 md:gap-8 md:pl-8"
            style={{ marginLeft: i % 2 === 0 ? "0" : "auto", maxWidth: i % 2 === 0 ? "100%" : "85%" }}
          >
            <div className="font-serif text-4xl font-medium text-foreground md:text-6xl">{stat.value}</div>
            <div>
              <div className="font-sans text-base font-light text-foreground md:text-xl">{stat.label}</div>
              <div className="font-mono text-xs text-foreground/60">{stat.sublabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
