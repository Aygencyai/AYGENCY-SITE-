# File Placement Guide

Where each file goes when you set up the project on your Mac Mini.

```
~/aygency/projects/aygency-site/
├── CLAUDE.md                          ← CLAUDE.md (from this bundle)
├── .claude/
│   └── commands/
│       ├── design-audit.md            ← commands/design-audit.md
│       ├── verify.md                  ← commands/verify.md
│       └── restyle.md                 ← commands/restyle.md
├── docs/
│   ├── homepage-design-spec.md        ← homepage-design-spec.md (your original prompt, for reference)
│   └── migration-prompts.md           ← migration-prompts.md (your session-by-session playbook)
└── [everything else from the repo]
```

## Quick Setup Script

Run this after cloning the repo:

```bash
cd ~/aygency/projects/aygency-site

# Create directories
mkdir -p .claude/commands docs

# Copy CLAUDE.md to project root
cp ~/Downloads/CLAUDE.md ./CLAUDE.md

# Copy slash commands
cp ~/Downloads/commands/design-audit.md ./.claude/commands/
cp ~/Downloads/commands/verify.md ./.claude/commands/
cp ~/Downloads/commands/restyle.md ./.claude/commands/

# Copy reference docs
cp ~/Downloads/homepage-design-spec.md ./docs/
cp ~/Downloads/migration-prompts.md ./docs/

# Adjust the cp paths above to wherever you downloaded the files
```

## How to Use the Slash Commands

Inside Claude Code:
- `/project:design-audit` — check any component against the design system
- `/project:verify` — full build + lint + colour/font audit
- `/project:restyle` — restyle a specific component (preserving logic)

## Session Order

Open `docs/migration-prompts.md` and work through sessions 1-8 in order. Each session is one Claude Code sitting. `/clear` between sessions.
