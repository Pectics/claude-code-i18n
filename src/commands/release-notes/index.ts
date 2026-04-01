import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const releaseNotes: Command = {
  description: t("View release notes", "commands.release_notes.description"),
  name: 'release-notes',
  type: 'local',
  supportsNonInteractive: true,
  load: () => import('./release-notes.js'),
}

export default releaseNotes
