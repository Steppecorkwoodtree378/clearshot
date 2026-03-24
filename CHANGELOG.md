# Changelog

## 1.2.0 (2026-03-24)

- Interactive onboarding: arrow-key pickers for update mode and telemetry during setup
- Two update modes: "always keep updated" (auto-pull) or "ask me every time"
- Simplified telemetry to two options: anonymous / off (removed confusing three-tier system)
- Interactive update prompt when new version detected (for "ask" mode users)
- Shared picker component (`bin/picker.sh`) used across all interactive prompts

## 1.1.0 (2026-03-24)

- Guaranteed trigger: setup now injects a BLOCKING REQUIREMENT into ~/.claude/CLAUDE.md
- Robust installer: handles broken symlinks, network failures, missing git
- Removed bloat: convex plugin manifest, package-lock, auto-generated files
- Symlink verification: setup now checks target matches actual repo location

## 1.0.0 (2026-03-24)

- Initial release: Clearshot — structured screenshot analysis skill for Claude Code
- 5-step analysis pipeline: spatial decomposition, element inventory, design tokens, layout architecture, interaction map
- Gate check with early exit for non-UI images
- Dual mode: analytical (engineer lens) + qualitative (designer lens)
- Dynamic step execution based on conversation context
- Auto-update checking via GitHub VERSION file
- Telemetry with 2 modes (anonymous / off)
- Self-rating protocol with field report generation
- Convex backend for telemetry aggregation
