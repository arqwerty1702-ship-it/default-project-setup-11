import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"
import { useContent, toArticle, type Article } from "@/data/articles"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SectionTabs } from "@/components/section-tabs"
import { Pager } from "@/components/pager"
import { CasesList } from "@/components/sections/work-section"
import { useTexts } from "@/data/texts"

type Tab = "articles" | "cases"

export function ArticlesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [active, setActive] = useState<Article | null>(null)
  const t = useTexts()
  const ALL = "__all__"
  const [filter, setFilter] = useState<string>(ALL)
  const [tab, setTab] = useState<Tab>("articles")
  const tabLabels: Record<Tab, string> = { articles: t("articles_tab_articles"), cases: t("articles_tab_cases") }
  const { data, isLoading } = useContent()
  const articles = (data?.articles ?? []).map(toArticle)
  const cases = data?.cases ?? []

  const categories = [ALL, ...Array.from(new Set(articles.map((a) => a.category)))]
  const filtered = filter === ALL ? articles : articles.filter((a) => a.category === filter)
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(filtered.length / 3))
  const current = Math.min(page, pages - 1)
  const list = filtered.slice(current * 3, current * 3 + 3)

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-5 pb-16 pt-24 md:h-screen md:px-12 md:py-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 flex flex-col gap-6 transition-all duration-700 md:mb-12 md:flex-row md:items-end md:justify-between ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div>
            <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
              {t("articles_title")}
            </h2>
            <p className="mb-5 font-mono text-sm text-foreground/60 md:text-base">
              {tab === "articles" ? t("articles_subtitle") : t("cases_subtitle")}
            </p>
            <SectionTabs
              tabs={[tabLabels.articles, tabLabels.cases]}
              value={tabLabels[tab]}
              onChange={(v) => setTab(v === tabLabels.cases ? "cases" : "articles")}
            />
          </div>
          <div className={`flex flex-wrap gap-2 ${tab === "articles" ? "" : "hidden"}`}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setFilter(c)
                  setPage(0)
                }}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-all ${
                  filter === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 bg-foreground/5 text-foreground/70 backdrop-blur-md hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {c === ALL ? t("articles_filter_all") : c}
              </button>
            ))}
          </div>
        </div>

        {tab === "cases" && <CasesList cases={cases} isVisible={isVisible} note={t("cases_note")} />}

        {tab === "articles" && isLoading && (
          <p className="font-mono text-sm text-foreground/50">Загружаем статьи...</p>
        )}
        {tab === "articles" && !isLoading && filtered.length === 0 && (
          <p className="font-mono text-sm text-foreground/50">Статей пока нет</p>
        )}

        <div className={`grid gap-4 md:grid-cols-3 md:gap-6 ${tab === "articles" ? "" : "hidden"}`}>
          {list.map((article, i) => (
            <button
              key={article.id}
              onClick={() => setActive(article)}
              className={`group flex flex-col rounded-2xl border border-foreground/10 bg-background/40 p-5 text-left backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-primary/50 hover:bg-background/60 md:p-7 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + i * 120}ms` }}
            >
              <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-primary md:mb-6">
                <span>{article.category}</span>
                <span className="text-foreground/40">{article.readTime}</span>
              </div>
              <h3 className="mb-3 font-serif text-2xl font-medium leading-tight text-foreground md:text-[1.75rem]">
                {article.title}
              </h3>
              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-foreground/70">{article.excerpt}</p>
              <div className="mt-auto flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="font-mono text-xs text-foreground/40">{article.date}</span>
                <span className="flex items-center gap-1 text-sm text-foreground transition-colors group-hover:text-primary">
                  {t("articles_read")}
                  <Icon name="ArrowUpRight" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {tab === "articles" && pages > 1 && (
          <Pager page={current} pages={pages} onChange={setPage} />
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl border-foreground/10 bg-card p-0 sm:rounded-2xl">
          {active && (
            <ScrollArea className="max-h-[85vh]">
              <div className="p-6 md:p-10">
                <DialogHeader className="mb-6 text-left">
                  <div className="mb-3 flex gap-3 font-mono text-[11px] uppercase tracking-wider text-primary">
                    <span>{active.category}</span>
                    <span className="text-foreground/40">
                      {active.date} · {active.readTime}
                    </span>
                  </div>
                  <DialogTitle className="font-serif text-3xl font-medium leading-tight md:text-4xl">
                    {active.title}
                  </DialogTitle>
                  <DialogDescription className="pt-2 text-base text-foreground/70">{active.excerpt}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
                  {active.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-8 rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm text-foreground/90">
                  {t("articles_cta")}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}