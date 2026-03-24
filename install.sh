#!/usr/bin/env bash
# clearshot installer — curl -fsSL https://raw.githubusercontent.com/udayanwalvekar/clearshot/main/install.sh | bash
set -e

SKILL_DIR="$HOME/.claude/skills/clearshot"

if [ -d "$SKILL_DIR" ]; then
  echo "updating clearshot..."
  cd "$SKILL_DIR" && git pull origin main --quiet
else
  echo "installing clearshot..."
  git clone --quiet https://github.com/udayanwalvekar/clearshot.git "$SKILL_DIR"
fi

cd "$SKILL_DIR" && bash ./setup
