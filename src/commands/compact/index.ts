import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

const compact = {
  type: 'local',
  name: 'compact',
  description:
    t("Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]", "commands.compact.description"),
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_COMPACT),
  supportsNonInteractive: true,
  argumentHint: t("<optional custom summarization instructions>", "commands.compact.argument_hint"),
  load: () => import('./compact.js'),
} satisfies Command

export default compact
