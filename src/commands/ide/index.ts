import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const ide = {
  type: 'local-jsx',
  name: 'ide',
  description: t("Manage IDE integrations and show status", "commands.ide.description"),
  argumentHint: t("[open]", "commands.ide.argument_hint"),
  load: () => import('./ide.js'),
} satisfies Command

export default ide
