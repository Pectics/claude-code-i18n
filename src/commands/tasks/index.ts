import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const tasks = {
  type: 'local-jsx',
  name: 'tasks',
  aliases: ['bashes'],
  description: t("List and manage background tasks", "commands.tasks.description"),
  load: () => import('./tasks.js'),
} satisfies Command

export default tasks
