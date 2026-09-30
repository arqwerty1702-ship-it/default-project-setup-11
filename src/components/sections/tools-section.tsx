import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"
import { SectionTabs } from "@/components/section-tabs"
import { Pager } from "@/components/pager"
import { useContent } from "@/data/articles"
import { useTexts } from "@/data/texts"
import { PenaltyCalc, DeductionCalc } from "@/components/sections/calculators"

type Tab = "links" | "calc"
const PER_PAGE = 4

export function ToolsSection() {
  const { ref, isVisible } = useReveal(0.3)
  const t = useTexts()
  const { data, isLoading } = useContent()
  const links = data?.links ?? []
  const [tab, setTab] = useState<Tab>("links")
  const [page, setPage] = useState(0)
  const tabLabels: Record<Tab, string> = { links: t("tools_tab_links"), calc: t("tools_tab_calc") }
  const pages = Math.max(1, Math.ceil(links.length / PER_PAGE))
  const current = Math.min(page, pages - 1)
  const list = links.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE)
  const reveal = isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-start px-5 pb-16 pt-24 md:h-screen md:overflow-y-auto md:px-12 md:pb-10 md:pt-28 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl md:my-auto">
        <div className={`mb-8 transition-all duration-700 md:mb-10 ${reveal}`}>
          <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t("tools_title")}
          </h2>
          <p className="mb-5 font-mono text-sm text-foreground/60 md:text-base">
            {tab === "links" ? t("tools_links_subtitle") : t("tools_calc_subtitle")}
          </p>
          <SectionTabs
            tabs={[tabLabels.links, tabLabels.calc]}
            value={tabLabels[tab]}
            onChange={(v) => setTab(v === tabLabels.calc ? "calc" : "links")}
          />
        </div>

        {tab === "links" && (
          <>
            {isLoading && <p className="font-mono text-sm text-foreground/50">Загружаем...</p>}
            {!isLoading && links.length === 0 && (
              <p className="font-mono text-sm text-foreground/50">Ссылок пока нет</p>
            )}
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
              {list.map((l, i) => (
                <a
                  key={l.id}
                  href={l.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-primary/50 ${reveal}`}
                  style={{ transitionDelay: `${100 + i * 100}ms` }}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-foreground/5">
                    {l.image_url ? (
                      <img
                        src={l.image_url}
                        alt={l.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-foreground/30">
                        <Icon name="Link" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3 md:p-5">
                    <h3 className="mb-1 flex items-start justify-between gap-2 font-serif text-lg leading-tight text-foreground md:text-xl">
                      <span>{l.title}</span>
                      <Icon
                        name="ArrowUpRight"
                        size={18}
                        className="mt-0.5 shrink-0 text-foreground/50 transition-colors group-hover:text-primary"
                      />
                    </h3>
                    {l.description && (
                      <p className="line-clamp-3 text-xs leading-relaxed text-foreground/60 md:text-sm">{l.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
            {pages > 1 && <Pager page={current} pages={pages} onChange={setPage} />}
          </>
        )}

        {tab === "calc" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <PenaltyCalc
                title={t("calc_penalty_title")}
                text={t("calc_penalty_text")}
                keyRate={Number(t("calc_key_rate").replace(",", ".")) || 0}
              />
              <DeductionCalc title={t("calc_deduction_title")} text={t("calc_deduction_text")} />
            </div>
            <p className="mt-4 font-mono text-xs text-foreground/50">{t("calc_note")}</p>
          </>
        )}
      </div>
    </section>
  )
}
