import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const help = {
  type: 'local-jsx',
  name: 'help',
  description: t("Show help and available commands", "commands.help.description"),
  load: () => import('./help.js'),
} satisfies Command

export default help
