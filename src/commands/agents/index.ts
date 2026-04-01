import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const agents = {
  type: 'local-jsx',
  name: 'agents',
  description: t("Manage agent configurations", "commands.agents.description"),
  load: () => import('./agents.js'),
} satisfies Command

export default agents
