import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const config = {
  aliases: ['settings'],
  type: 'local-jsx',
  name: 'config',
  description: t("Open config panel", "commands.config.description"),
  load: () => import('./config.js'),
} satisfies Command

export default config
