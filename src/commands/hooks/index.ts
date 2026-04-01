import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const hooks = {
  type: 'local-jsx',
  name: 'hooks',
  description: t("View hook configurations for tool events", "commands.hooks.description"),
  immediate: true,
  load: () => import('./hooks.js'),
} satisfies Command

export default hooks
