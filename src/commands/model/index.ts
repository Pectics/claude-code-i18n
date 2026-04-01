import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'
import { getMainLoopModel, renderModelName } from '../../utils/model/model.js'

export default {
  type: 'local-jsx',
  name: 'model',
  get description() {
    return t("Set the AI model for Claude Code (currently {0})", "commands.model.description", renderModelName(getMainLoopModel()))
  },
  argumentHint: t("[model]", "commands.model.argument_hint"),
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./model.js'),
} satisfies Command
