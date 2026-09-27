import { useReveal } from "@/hooks/use-reveal"

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

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Практика
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Дела, которые мы выиграли</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {cases.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>

        <p
          className={`mt-10 max-w-xl font-mono text-xs text-foreground/50 transition-all duration-700 md:text-sm ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          Имена клиентов не раскрываем — адвокатская тайна. Подробности дел готовы обсудить на консультации.
        </p>
      </div>
    </section>
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
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex items-center justify-between gap-4 border-b border-foreground/10 py-5 transition-all duration-700 hover:border-primary/50 md:py-7 ${getRevealClass()}`}
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
