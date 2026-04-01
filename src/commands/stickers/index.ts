import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const stickers = {
  type: 'local',
  name: 'stickers',
  description: t("Order Claude Code stickers", "commands.stickers.description"),
  supportsNonInteractive: false,
  load: () => import('./stickers.js'),
} satisfies Command

export default stickers
