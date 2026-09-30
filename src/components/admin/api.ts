import { CONTENT_URL, type RawContent } from "@/data/articles"

export type ContentType = "articles" | "cases" | "services" | "links" | "faq"

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

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error("Картинка больше 5 МБ — уменьшите её")
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("Не удалось прочитать файл"))
    r.readAsDataURL(file)
  })
  const res = await fetch(CONTENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "upload_image", content_type: file.type, data: dataUrl, password: getPassword() }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Не удалось загрузить картинку")
  return data.url
}
