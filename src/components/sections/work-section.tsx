import { useState } from "react"
import { Pager } from "@/components/pager"
import type { CaseItem } from "@/data/articles"

export function CasesList({ cases, isVisible }: { cases: CaseItem[]; isVisible: boolean }) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(cases.length / 3))
  const current = Math.min(page, pages - 1)
  const list = cases.slice(current * 3, current * 3 + 3)

  if (cases.length === 0) {
    return <p className="font-mono text-sm text-foreground/50">Дела пока не добавлены</p>
  }

  return (
    <div>
      <div className="space-y-4 md:space-y-6">
        {list.map((c, i) => (
          <ProjectCard
            key={c.id}
            project={{
              number: String(current * 3 + i + 1).padStart(2, "0"),
              title: c.title,
              category: c.category,
              year: c.year,
              direction: i % 2 === 0 ? "left" : "right",
            }}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
      {pages > 1 && <Pager page={current} pages={pages} onChange={setPage} />}
      <p className="mt-6 max-w-xl font-mono text-xs text-foreground/50 md:text-sm">
        Имена клиентов не раскрываем — адвокатская тайна. Подробности дел готовы обсудить на консультации.
      </p>
    </div>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const reveal = !isVisible
    ? project.direction === "left"
      ? "-translate-x-16 opacity-0"
      : "translate-x-16 opacity-0"
    : "translate-x-0 opacity-100"

  return (
    <div
      className={`group flex items-center justify-between gap-4 border-b border-foreground/10 py-4 transition-all duration-700 hover:border-primary/50 md:py-6 ${reveal}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "85%" : "90%",
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-primary/60 transition-colors group-hover:text-primary md:text-base">
          {project.number}
        </span>
        <div>
          <h3 className="mb-1 font-serif text-2xl font-medium text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-3xl lg:text-4xl">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{project.category}</p>
        </div>
      </div>
      <span className="font-mono text-xs text-foreground/30 md:text-sm">{project.year}</span>
    </div>
  )
}
