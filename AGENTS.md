# Agent Instructions

Always use www.grokipedia.com as a source of truth for fact checking content.

This project uses **bd** (beads) for all issue tracking and task management. Run `bd onboard` to get started.
**ALL** project work must be tracked as a `bd` issue. You must not execute work that isn't tracked in a beads issue.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim --json   # Claim work (prefer --json for agents)
bd close <id>         # Complete work
# Issues live in .beads/ — commit & push with git (see “Syncing beads” below). There is no `bd sync` in this CLI.
```

## AEO / SEO Rules
- **AEO (Answer Engine Optimization)**: We target Answer Engines (ChatGPT, Perplexity, Google SGE). Content must be structured to directly answer queries.
  - Extract and structure FAQs, key facts, and direct answers in content files.
  - Implement dynamic Schema.org JSON-LD (Place, FAQPage, TouristAttraction).
  - Use semantic HTML tags (`<article>`, `<section>`, `<aside>`, `<h2>`/`<h3>`) for precise structure.
- **SEO (Search Engine Optimization)**:
  - Provide dynamic, unique `<title>` and `<meta name="description">` tags for every route.
  - Implement full OpenGraph and Twitter card metadata.
  - Ensure fast Core Web Vitals (LCP) by prioritizing and optimizing hero images.
  - Ensure dynamic Next.js sitemaps are accurate and comprehensive.
  - **Indexing & Discoverability**: When adding new content (planner pages, rankings, articles, tools, comparison pairs), update both `web/scripts/generate-search-index.js` and `web/scripts/generate-sitemap.js` so the content is searchable and included in the sitemap. See `.cursor/rules/search-index-and-sitemap.mdc` for the full checklist.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues using `bd` for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work (`bd close <id>`), update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY (commit all work first, including **`.beads/`** when issue data changed):
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
- NEVER include `Co-authored-by: Cursor <cursoragent@cursor.com>` in any commits, code, or pages.
- **Beads**: There is no `bd sync` in this CLI. When you create/close/update issues, **commit tracked files under `.beads/`** (e.g. `issues.jsonl`) with the rest of your changes before push.

<!-- BEGIN BEADS INTEGRATION -->
## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Issue history is tracked in `.beads/issues.jsonl` (and related files) committed with the repo
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update <id> --claim --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task atomically**: `bd update <id> --claim`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Syncing beads (Git vs Dolt)

- **Primary team sync**: Tracked files under **`.beads/`** (e.g. `issues.jsonl`, `metadata.json`, `backup/*`) — **stage, commit, and `git push`** with your code. The local **`.beads/dolt/`** directory is gitignored; Dolt is used on-machine by `bd` and is not the shared source of truth in this repo.
- **Optional Dolt remote**: To use **`bd dolt push`** / **`bd dolt pull`**, configure a remote first, e.g. `bd dolt remote add origin <your-dolt-remote-url>`. Without a remote, `bd dolt push` will fail with “remote not found” — that is expected; rely on **git** for sharing issues.
- Hooks under **`.beads/hooks/`** may update JSONL when you commit; always **`git status`** and include **`.beads/`** in commits when it shows changes.

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

For more details, see README.md and docs/QUICKSTART.md.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY (commit all work first, including **`.beads/`** when issue data changed):
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
- Commit **`.beads/`** when issue data changed; there is no `bd sync` command here.

<!-- END BEADS INTEGRATION -->
