import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const files = {
  type: 'local',
  name: 'files',
  description: t("List all files currently in context", "commands.files.description"),
  isEnabled: () => process.env.USER_TYPE === 'ant',
  supportsNonInteractive: true,
  load: () => import('./files.js'),
} satisfies Command

export default files
