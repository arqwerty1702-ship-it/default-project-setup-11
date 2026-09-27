import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

const services = [
  {
    icon: "FileSearch",
    title: "Проверка объекта и сделки",
    description: "Юридическая экспертиза квартиры, дома или участка, проверка продавца, подготовка договора и безопасных расчётов.",
    price: "от 15 000 ₽",
    direction: "top",
  },
  {
    icon: "Building2",
    title: "Споры с застройщиками",
    description: "Неустойка за просрочку, недостатки отделки, расторжение ДДУ и возврат средств дольщикам.",
    price: "от 25 000 ₽",
    direction: "right",
  },
  {
    icon: "Trees",
    title: "Земельное право",
    description: "Межевые споры, изменение вида разрешённого использования, оформление и узаконивание построек.",
    price: "от 20 000 ₽",
    direction: "left",
  },
  {
    icon: "Scale",
    title: "Судебная защита",
    description: "Раздел имущества, наследство, выселение, оспаривание сделок — представительство во всех инстанциях.",
    price: "от 40 000 ₽",
    direction: "bottom",
  },
]

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-10 transition-all duration-700 md:mb-14 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Услуги
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Всё, что связано с недвижимостью</p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 md:gap-x-16 md:gap-y-12 lg:gap-x-24">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: (typeof services)[number]
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <div
      className={`group transition-all duration-700 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <Icon name={service.icon} size={16} className="text-primary" />
        <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
        <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
      </div>
      <h3 className="mb-2 font-serif text-2xl font-medium text-foreground md:text-3xl">{service.title}</h3>
      <p className="mb-2 max-w-md text-sm leading-relaxed text-foreground/80 md:text-base">{service.description}</p>
      <span className="font-mono text-xs text-primary md:text-sm">{service.price}</span>
    </div>
  )
}
