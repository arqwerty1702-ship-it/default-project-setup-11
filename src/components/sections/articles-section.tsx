import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"
import { articles, type Article } from "@/data/articles"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ArticlesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [active, setActive] = useState<Article | null>(null)
  const [filter, setFilter] = useState<string>("Все")

  const categories = ["Все", ...Array.from(new Set(articles.map((a) => a.category)))]
  const list = (filter === "Все" ? articles : articles.filter((a) => a.category === filter)).slice(0, 3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 flex flex-col gap-6 transition-all duration-700 md:mb-12 md:flex-row md:items-end md:justify-between ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div>
            <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Статьи
            </h2>
            <p className="font-mono text-sm text-foreground/60 md:text-base">/ Разбираем актуальные вопросы</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-all ${
                  filter === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 bg-foreground/5 text-foreground/70 backdrop-blur-md hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {list.map((article, i) => (
            <button
              key={article.id}
              onClick={() => setActive(article)}
              className={`group flex flex-col rounded-2xl border border-foreground/10 bg-background/40 p-5 text-left backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-primary/50 hover:bg-background/60 md:p-7 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              } ${i > 0 ? "hidden md:flex" : ""}`}
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
                  Читать
                  <Icon name="ArrowUpRight" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
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
                  Остались вопросы по вашей ситуации? Оставьте заявку в разделе «Контакты» — первичная консультация бесплатна.
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
