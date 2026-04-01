import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
  description: t("Show your Claude Code usage statistics and activity", "commands.stats.description"),
  load: () => import('./stats.js'),
} satisfies Command

export default stats
