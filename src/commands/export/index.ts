import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const exportCommand = {
  type: 'local-jsx',
  name: 'export',
  description: t("Export the current conversation to a file or clipboard", "commands.export.description"),
  argumentHint: t("[filename]", "commands.export.argument_hint"),
  load: () => import('./export.js'),
} satisfies Command

export default exportCommand
