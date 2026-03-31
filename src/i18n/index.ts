import enMessages from './locales/en.json'
import zhCNMessages from './locales/zh-CN.json'

type Messages = Record<string, string>

const messages: Messages = { ...(enMessages as Messages), ...(zhCNMessages as Messages) }

export function t(fallback: string, key: string): string {
  return messages[key] ?? fallback
}
