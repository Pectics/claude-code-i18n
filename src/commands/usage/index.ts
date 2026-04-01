import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

export default {
  type: 'local-jsx',
  name: 'usage',
  description: t("Show plan usage limits", "commands.usage.description"),
  availability: ['claude-ai'],
  load: () => import('./usage.js'),
} satisfies Command
