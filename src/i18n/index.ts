import enusMessages from './locales/en-US.json'
import zhcnMessages from './locales/zh-CN.json'

type Messages = Record<string, string>

const messages: Messages = { ...(enusMessages as Messages), ...(zhcnMessages as Messages) }

export function t(fallback: string, key: string, ...args: unknown[]): string {
  const message = messages[key] ?? fallback;
  return message.replace(/\{([^}]+)\}/g, (_, placeholder) => {
    const index = parseInt(placeholder, 10);
    return isNaN(index) ? placeholder : String(args[index]);
  });
}
