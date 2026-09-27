import { useQuery } from "@tanstack/react-query"
import func2url from "../../backend/func2url.json"

export const CONTENT_URL = (func2url as Record<string, string>).content

export interface Article {
  id: number
  title: string
  category: string
  date: string
  readTime: string
  excerpt: string
  body: string[]
}

export interface CaseItem {
  id: number
  title: string
  category: string
  year: string
}

export interface RawArticle {
  id: number
  title: string
  category: string
  date_label: string
  read_time: string
  excerpt: string
  body: string
  sort_order: number
}

export interface RawCase {
  id: number
  title: string
  category: string
  year: string
  sort_order: number
}

export interface RawContent {
  articles: RawArticle[]
  cases: RawCase[]
}

export const toArticle = (a: RawArticle): Article => ({
  id: a.id,
  title: a.title,
  category: a.category,
  date: a.date_label,
  readTime: a.read_time,
  excerpt: a.excerpt,
  body: a.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
})

export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: async (): Promise<RawContent> => {
      const res = await fetch(CONTENT_URL)
      if (!res.ok) throw new Error("Не удалось загрузить данные")
      return res.json()
    },
    staleTime: 60_000,
  })
}
