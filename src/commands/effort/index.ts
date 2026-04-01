import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'

export default {
  type: 'local-jsx',
  name: 'effort',
  description: t("Set effort level for model usage", "commands.effort.description"),
  argumentHint: t("[low|medium|high|max|auto]", "commands.effort.argument_hint"),
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./effort.js'),
} satisfies Command
