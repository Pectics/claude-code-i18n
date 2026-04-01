import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const resume: Command = {
  type: 'local-jsx',
  name: 'resume',
  description: t("Resume a previous conversation", "commands.resume.description"),
  aliases: ['continue'],
  argumentHint: t("[conversation id or search term]", "commands.resume.argument_hint"),
  load: () => import('./resume.js'),
}

export default resume
