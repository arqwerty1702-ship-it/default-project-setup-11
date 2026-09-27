import { Fragment } from "react"

export function AccentText({ text, accentClass = "italic text-primary" }: { text: string; accentClass?: string }) {
  const lines = text.split("\n")
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, i) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
              <em key={i} className={`font-normal ${accentClass}`}>
                {part.slice(1, -1)}
              </em>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  )
}
