import { useState } from "react"

const money = (n: number) =>
  Number.isFinite(n) ? `${Math.round(n).toLocaleString("ru-RU")} ₽` : "—"

const num = (s: string) => Number(s.replace(/\s/g, "").replace(",", ".")) || 0

const field =
  "w-full border-b border-foreground/30 bg-transparent py-1.5 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
const label = "mb-1 block font-mono text-xs text-foreground/60"
const card = "flex flex-col rounded-2xl border border-foreground/10 bg-background/40 p-5 backdrop-blur-xl md:p-7"

function Money({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      inputMode="numeric"
      className={field}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "")
        onChange(digits ? Number(digits).toLocaleString("ru-RU") : "")
      }}
    />
  )
}

export function PenaltyCalc({ title, text, keyRate }: { title: string; text: string; keyRate: number }) {
  const [price, setPrice] = useState("6 000 000")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [rate, setRate] = useState(String(keyRate))

  const days = from && to ? Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000)) : 0
  const penalty = (num(price) * num(rate)) / 100 / 150 * days

  return (
    <div className={card}>
      <h3 className="mb-2 font-serif text-2xl font-medium text-foreground md:text-3xl">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-foreground/70">{text}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <span className={label}>Цена по договору, ₽</span>
          <Money value={price} onChange={setPrice} />
        </div>
        <div>
          <span className={label}>Срок сдачи по договору</span>
          <input type="date" className={`${field} [color-scheme:dark]`} value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <span className={label}>Дата передачи / сегодня</span>
          <input type="date" className={`${field} [color-scheme:dark]`} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <span className={label}>Ключевая ставка, %</span>
          <input inputMode="decimal" className={field} value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <span className={label}>Дней просрочки</span>
          <div className="py-1.5 text-base text-foreground">{days}</div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
        <div className="font-mono text-xs text-foreground/60">Неустойка</div>
        <div className="font-serif text-3xl text-foreground">{from ? money(penalty) : "Укажите срок сдачи"}</div>
        {from && penalty > 0 && (
          <div className="mt-1 text-xs text-foreground/60">
            + штраф 50% в суде — до {money(penalty * 1.5)} вместе с неустойкой
          </div>
        )}
      </div>
    </div>
  )
}

export function DeductionCalc({ title, text }: { title: string; text: string }) {
  const [price, setPrice] = useState("6 000 000")
  const [interest, setInterest] = useState("")
  const [salary, setSalary] = useState("100 000")

  const property = Math.min(num(price), 2_000_000) * 0.13
  const mortgage = Math.min(num(interest), 3_000_000) * 0.13
  const total = property + mortgage
  const perYear = num(salary) * 12 * 0.13

  return (
    <div className={card}>
      <h3 className="mb-2 font-serif text-2xl font-medium text-foreground md:text-3xl">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-foreground/70">{text}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <span className={label}>Стоимость жилья, ₽</span>
          <Money value={price} onChange={setPrice} />
        </div>
        <div>
          <span className={label}>Уплаченные проценты по ипотеке, ₽</span>
          <Money value={interest} onChange={setInterest} placeholder="0" />
        </div>
        <div>
          <span className={label}>Зарплата в месяц до вычета НДФЛ, ₽</span>
          <Money value={salary} onChange={setSalary} />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
        <div className="font-mono text-xs text-foreground/60">Можно вернуть</div>
        <div className="font-serif text-3xl text-foreground">{money(total)}</div>
        <div className="mt-1 text-xs text-foreground/60">
          За жильё до {money(property)}, по процентам до {money(mortgage)}
          {perYear > 0 && total > 0 && ` · около ${Math.max(1, Math.ceil(total / perYear))} г. при вашей зарплате`}
        </div>
      </div>
    </div>
  )
}
