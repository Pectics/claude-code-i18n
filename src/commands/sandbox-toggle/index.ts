import figures from 'figures'
import type { Command } from '../../commands.js'
import { SandboxManager } from '../../utils/sandbox/sandbox-adapter.js'
import { t } from 'src/i18n/index.js'

const command = {
  name: 'sandbox',
  get description() {
    const currentlyEnabled = SandboxManager.isSandboxingEnabled()
    const autoAllow = SandboxManager.isAutoAllowBashIfSandboxedEnabled()
    const allowUnsandboxed = SandboxManager.areUnsandboxedCommandsAllowed()
    const isLocked = SandboxManager.areSandboxSettingsLockedByPolicy()
    const hasDeps = SandboxManager.checkDependencies().errors.length === 0

    // Show warning icon if dependencies missing, otherwise enabled/disabled status
    let icon: string
    if (!hasDeps) {
      icon = figures.warning
    } else {
      icon = currentlyEnabled ? figures.tick : figures.circle
    }

    let statusText = t("sandbox disabled", "commands.sandbox_toggle.description.status.disabled")
    if (currentlyEnabled) {
      statusText = autoAllow
        ? t("sandbox enabled (auto-allow)", "commands.sandbox_toggle.description.status.enabled.auto_allow_bash")
        : t("sandbox enabled", "commands.sandbox_toggle.description.status.enabled")

      // Add unsandboxed fallback status
      statusText += allowUnsandboxed ? t(", fallback allowed", "commands.sandbox_toggle.description.status.unsandboxed_commands_allowed") : ''
    }

    if (isLocked) {
      statusText += t(" (managed)", "commands.sandbox_toggle.description.status.settings_locked_by_policy")
    }

    return t("{0} {1} (⏎ to configure)", "commands.sandbox_toggle.description", icon, statusText)
  },
  argumentHint: t("exclude \"command pattern\"", "commands.sandbox_toggle.argument_hint"),
  get isHidden() {
    return (
      !SandboxManager.isSupportedPlatform() ||
      !SandboxManager.isPlatformInEnabledList()
    )
  },
  immediate: true,
  type: 'local-jsx',
  load: () => import('./sandbox-toggle.js'),
} satisfies Command

export default command
