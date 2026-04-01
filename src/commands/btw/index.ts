import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const btw = {
  type: 'local-jsx',
  name: 'btw',
  description:
    t("Ask a quick side question without interrupting the main conversation", "commands.btw.description"),
  immediate: true,
  argumentHint: t("<question>", "commands.btw.argument_hint"),
  load: () => import('./btw.js'),
} satisfies Command

export default btw
