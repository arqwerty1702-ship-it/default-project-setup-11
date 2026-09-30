import { useState, type ReactNode } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MagneticButton } from "@/components/magnetic-button"
import { useContent } from "@/data/articles"
import { useTexts } from "@/data/texts"

const LINK_RE = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+)/g

function Linkified({ text }: { text: string }) {
  const parts: ReactNode[] = text.split(LINK_RE).map((part, i) => {
    const md = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
    const href = md ? md[2] : /^https?:\/\//.test(part) ? part : null
    if (!href) return part
    return (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">
        {md ? md[1] : part}
      </a>
    )
  })
  return <>{parts}</>
}

export function FaqSection({ onAsk }: { onAsk: () => void }) {
  const { ref, isVisible } = useReveal(0.3)
  const t = useTexts()
  const { data, isLoading } = useContent()
  const faq = data?.faq ?? []
  const ALL = "__all__"
  const [filter, setFilter] = useState(ALL)
  const categories = [ALL, ...Array.from(new Set(faq.map((f) => f.category).filter(Boolean)))]
  const list = filter === ALL ? faq : faq.filter((f) => f.category === filter)
  const reveal = isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-5 pb-16 pt-24 md:h-screen md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:h-full md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div className={`transition-all duration-700 md:self-center ${reveal}`}>
          <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t("faq_title")}
          </h2>
          <p className="mb-6 font-mono text-sm text-foreground/60 md:text-base">{t("faq_subtitle")}</p>
          {categories.length > 2 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-all ${
                    filter === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/15 bg-foreground/5 text-foreground/70 backdrop-blur-md hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {c === ALL ? t("faq_filter_all") : c}
                </button>
              ))}
            </div>
          )}
          <p className="mb-4 hidden max-w-sm text-sm leading-relaxed text-foreground/70 md:block">{t("faq_cta")}</p>
          <div className="hidden md:block">
            <MagneticButton variant="secondary" onClick={onAsk}>
              {t("faq_cta_button")}
            </MagneticButton>
          </div>
        </div>

        <div
          className={`transition-all delay-150 duration-700 md:overflow-y-auto md:self-center md:max-h-full md:pr-2 ${reveal}`}
          style={{ scrollbarWidth: "thin" }}
        >
          {isLoading && <p className="font-mono text-sm text-foreground/50">Загружаем...</p>}
          {!isLoading && list.length === 0 && <p className="font-mono text-sm text-foreground/50">Вопросов пока нет</p>}
          <Accordion
            type="single"
            collapsible
            key={filter}
            className="rounded-2xl border border-foreground/10 bg-background/40 px-5 backdrop-blur-xl md:px-7"
          >
            {list.map((f) => (
              <AccordionItem key={f.id} value={String(f.id)} className="border-foreground/10 last:border-0">
                <AccordionTrigger className="gap-4 py-5 text-left font-serif text-lg font-medium text-foreground hover:no-underline hover:text-primary md:text-xl">
                  {f.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-2 text-[15px] leading-relaxed text-foreground/80">
                    {f.answer
                      .split(/\n\s*\n/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((p, i) => (
                        <p key={i} className="whitespace-pre-line">
                          <Linkified text={p} />
                        </p>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 md:hidden">
            <p className="mb-4 text-sm leading-relaxed text-foreground/70">{t("faq_cta")}</p>
            <MagneticButton variant="secondary" onClick={onAsk} className="w-full">
              {t("faq_cta_button")}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
