import { CONTENT_URL, type RawContent } from "@/data/articles"

export type ContentType = "articles" | "cases" | "services"

const KEY = "ld_admin_password"

export const getPassword = () => sessionStorage.getItem(KEY) || ""
export const setPassword = (p: string) => sessionStorage.setItem(KEY, p)
export const clearPassword = () => sessionStorage.removeItem(KEY)

export async function adminRequest(
  method: "POST" | "PUT" | "DELETE",
  body: Record<string, unknown>,
  password = getPassword(),
): Promise<RawContent & { ok?: boolean }> {
  const res = await fetch(CONTENT_URL, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Ошибка сохранения")
  return data
}
