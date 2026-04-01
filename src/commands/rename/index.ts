import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const rename = {
  type: 'local-jsx',
  name: 'rename',
  description: t("Rename the current conversation", "commands.rename.description"),
  immediate: true,
  argumentHint: t("[name]", "commands.rename.argument_hint"),
  load: () => import('./rename.js'),
} satisfies Command

export default rename
