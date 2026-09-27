import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"
import { SectionTabs } from "@/components/section-tabs"
import { AboutContent } from "@/components/sections/about-section"
import { useContent } from "@/data/articles"
import { useTexts } from "@/data/texts"
import { AccentText } from "@/components/rich-text"
import func2url from "../../../backend/func2url.json"

const LEADS_URL = (func2url as Record<string, string>).leads

type Tab = "contacts" | "about"

type Errors = Partial<Record<"name" | "phone" | "message", string>>

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const t = useTexts()
  const topics = t("form_topics").split(",").map((x) => x.trim()).filter(Boolean)
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", topic: "" })
  const topic = topics.includes(formData.topic) ? formData.topic : topics[0] ?? ""
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [tab, setTab] = useState<Tab>("contacts")
  const tabLabels: Record<Tab, string> = { contacts: t("contacts_tab_contacts"), about: t("contacts_tab_about") }
  const { data } = useContent()
  const st = data?.settings ?? {}
  const phone = st.phone || ""
  const email = st.email || ""
  const socials = [
    { name: "Telegram", url: st.telegram },
    { name: "WhatsApp", url: st.whatsapp },
    { name: "VK", url: st.vk },
  ].filter((x) => x.url)

  const validate = () => {
    const e: Errors = {}
    if (formData.name.trim().length < 2) e.name = "Укажите имя"
    const digits = formData.phone.replace(/\D/g, "")
    if (digits.length < 10 || digits.length > 12) e.phone = "Проверьте номер телефона"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || !validate()) return

    setIsSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch(LEADS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, topic }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Не удалось отправить заявку")
      setSubmitSuccess(true)
      setFormData({ name: "", phone: "", message: "", topic: "" })
      setTimeout(() => setSubmitSuccess(false), 8000)
    } catch (err) {
      setSubmitError(
        `${err instanceof Error ? err.message : "Не удалось отправить заявку"}. Позвоните нам: ${phone}`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const field =
    "w-full border-b bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors"
  const border = (k: keyof Errors) =>
    errors[k] ? "border-red-400/80" : "border-foreground/30 focus:border-primary"

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-5 pb-16 pt-24 md:h-screen md:px-12 md:py-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 md:mb-10">
          <SectionTabs
            tabs={[tabLabels.contacts, tabLabels.about]}
            value={tabLabels[tab]}
            onChange={(v) => setTab(v === tabLabels.about ? "about" : "contacts")}
          />
        </div>
        {tab === "about" && <AboutContent onConsult={() => setTab("contacts")} />}
        <div className={`grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24 ${tab === "contacts" ? "" : "hidden"}`}>
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-serif text-4xl font-medium leading-[1.0] tracking-tight text-foreground md:mb-3 md:text-6xl lg:text-7xl">
                <AccentText text={t("contacts_title")} />
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">{t("contacts_subtitle")}</p>
            </div>

            <div className="space-y-4 md:space-y-7">
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="Phone" size={12} className="text-primary" />
                  <span className="font-mono text-xs text-foreground/60">{t("label_phone")}</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {phone}
                </p>
              </a>

              <a
                href={`mailto:${email}`}
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "250ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="Mail" size={12} className="text-primary" />
                  <span className="font-mono text-xs text-foreground/60">{t("label_email")}</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {email}
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
                  <span className="font-mono text-xs text-foreground/60">{t("label_office")}</span>
                </div>
                <p className="text-base text-foreground md:text-2xl">{st.address}</p>
                <p className="font-mono text-xs text-foreground/50">{st.hours}</p>
              </div>

              <div
                className={`flex gap-4 pt-2 transition-all duration-700 md:pt-2 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-primary hover:text-foreground"
                  >
                    {social.name}
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
                <label className="mb-2 block font-mono text-xs text-foreground/60">{t("form_topic_label")}</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((tp) => (
                    <button
                      type="button"
                      key={tp}
                      onClick={() => setFormData({ ...formData, topic: tp })}
                      className={`rounded-full border px-3 py-1 font-mono text-xs transition-all ${
                        topic === tp
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/20 text-foreground/70 hover:border-foreground/40"
                      }`}
                    >
                      {tp}
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
                <label className="mb-1 block font-mono text-xs text-foreground/60">{t("form_name_label")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${field} ${border("name")}`}
                  placeholder={t("form_name_placeholder")}
                />
                {errors.name && <p className="mt-1 font-mono text-xs text-red-300">{errors.name}</p>}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60">{t("form_phone_label")}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`${field} ${border("phone")}`}
                  placeholder={t("form_phone_placeholder")}
                />
                {errors.phone && <p className="mt-1 font-mono text-xs text-red-300">{errors.phone}</p>}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60">{t("form_message_label")}</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${field} resize-none ${border("message")}`}
                  placeholder={t("form_message_placeholder")}
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
                  {isSubmitting ? "Отправляем..." : t("form_submit")}
                </MagneticButton>
                {submitSuccess ? (
                  <p className="mt-3 text-center font-mono text-sm text-primary">
                    {t("form_success")}
                  </p>
                ) : submitError ? (
                  <p className="mt-3 text-center font-mono text-xs text-red-300">{submitError}</p>
                ) : (
                  <p className="mt-3 text-center font-mono text-[11px] text-foreground/40">
                    {t("form_consent")}
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