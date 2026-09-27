import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"
import { SectionTabs } from "@/components/section-tabs"
import { AboutContent } from "@/components/sections/about-section"

const TABS = ["Контакты", "О нас"] as const

const topics = ["Сделка", "Застройщик", "Земля", "Суд"]

type Errors = Partial<Record<"name" | "phone" | "message", string>>

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", topic: topics[0] })
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [tab, setTab] = useState<(typeof TABS)[number]>("Контакты")

  const validate = () => {
    const e: Errors = {}
    if (formData.name.trim().length < 2) e.name = "Укажите имя"
    const digits = formData.phone.replace(/\D/g, "")
    if (digits.length < 10 || digits.length > 12) e.phone = "Проверьте номер телефона"
    if (formData.message.trim().length < 10) e.message = "Опишите ситуацию хотя бы в паре слов"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || !validate()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", phone: "", message: "", topic: topics[0] })
    setTimeout(() => setSubmitSuccess(false), 6000)
  }

  const field =
    "w-full border-b bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors"
  const border = (k: keyof Errors) =>
    errors[k] ? "border-red-400/80" : "border-foreground/30 focus:border-primary"

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 md:mb-10">
          <SectionTabs tabs={TABS} value={tab} onChange={setTab} />
        </div>
        {tab === "О нас" && <AboutContent onConsult={() => setTab("Контакты")} />}
        <div className={`grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24 ${tab === "Контакты" ? "" : "hidden"}`}>
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-serif text-4xl font-medium leading-[1.0] tracking-tight text-foreground md:mb-3 md:text-6xl lg:text-7xl">
                Расскажите
                <br />
                <span className="italic text-primary">о ситуации</span>
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Первичная консультация — бесплатно</p>
            </div>

            <div className="space-y-4 md:space-y-7">
              <a
                href="tel:+74950000000"
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="Phone" size={12} className="text-primary" />
                  <span className="font-mono text-xs text-foreground/60">Телефон</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  +7 (495) 000-00-00
                </p>
              </a>

              <a
                href="mailto:help@legaldome.ru"
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "250ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="Mail" size={12} className="text-primary" />
                  <span className="font-mono text-xs text-foreground/60">Email</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  help@legaldome.ru
                </p>
              </a>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="MapPin" size={12} className="text-primary" />
                  <span className="font-mono text-xs text-foreground/60">Офис</span>
                </div>
                <p className="text-base text-foreground md:text-2xl">Москва, Пречистенская наб., 17</p>
                <p className="font-mono text-xs text-foreground/50">Пн–Пт 9:00–20:00, Сб по записи</p>
              </div>

              <div
                className={`flex gap-4 pt-2 transition-all duration-700 md:pt-2 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {["Telegram", "WhatsApp", "VK"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-primary hover:text-foreground"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate className="space-y-4 md:space-y-5">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <label className="mb-2 block font-mono text-xs text-foreground/60">Вопрос</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormData({ ...formData, topic: t })}
                      className={`rounded-full border px-3 py-1 font-mono text-xs transition-all ${
                        formData.topic === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/20 text-foreground/70 hover:border-foreground/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "250ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${field} ${border("name")}`}
                  placeholder="Как к вам обращаться"
                />
                {errors.name && <p className="mt-1 font-mono text-xs text-red-300">{errors.name}</p>}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`${field} ${border("phone")}`}
                  placeholder="+7 900 000-00-00"
                />
                {errors.phone && <p className="mt-1 font-mono text-xs text-red-300">{errors.phone}</p>}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60">Коротко о ситуации</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${field} resize-none ${border("message")}`}
                  placeholder="Например: покупаю квартиру, хочу проверить продавца"
                />
                {errors.message && <p className="mt-1 font-mono text-xs text-red-300">{errors.message}</p>}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <MagneticButton variant="primary" size="lg" className="w-full">
                  {isSubmitting ? "Отправляем..." : "Получить консультацию"}
                </MagneticButton>
                {submitSuccess ? (
                  <p className="mt-3 text-center font-mono text-sm text-primary">
                    Заявка принята. Юрист перезвонит в течение 30 минут.
                  </p>
                ) : (
                  <p className="mt-3 text-center font-mono text-[11px] text-foreground/40">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}