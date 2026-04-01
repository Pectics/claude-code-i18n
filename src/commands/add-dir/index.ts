import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const addDir = {
  type: 'local-jsx',
  name: 'add-dir',
  description: t("Add a new working directory", "commands.add_dir.description"),
  argumentHint: t("<path>", "commands.add_dir.argument_hint"),
  load: () => import('./add-dir.js'),
} satisfies Command

export default addDir
