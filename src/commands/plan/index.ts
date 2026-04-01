import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const plan = {
  type: 'local-jsx',
  name: 'plan',
  description: t("Enable plan mode or view the current session plan", "commands.plan.description"),
  argumentHint: t("[open|<description>]", "commands.plan.argument_hint"),
  load: () => import('./plan.js'),
} satisfies Command

export default plan
