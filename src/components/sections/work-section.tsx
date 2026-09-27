const cases = [
  {
    number: "01",
    title: "Вернули 4,2 млн ₽ покупателю",
    category: "Сделка с банкротом-продавцом · Арбитражный суд",
    year: "2026",
    direction: "left",
  },
  {
    number: "02",
    title: "Неустойка 1,8 млн ₽ с застройщика",
    category: "Защита 12 дольщиков ЖК · Районный суд",
    year: "2025",
    direction: "right",
  },
  {
    number: "03",
    title: "Узаконили дом на 240 м²",
    category: "Самовольная постройка · Признание права",
    year: "2025",
    direction: "left",
  },
]

export function CasesList({ isVisible }: { isVisible: boolean }) {
  return (
    <div>
      <div className="space-y-4 md:space-y-6">
        {cases.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
        ))}
      </div>
      <p className="mt-8 max-w-xl font-mono text-xs text-foreground/50 md:text-sm">
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
