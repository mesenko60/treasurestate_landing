# Agent Instructions

This project uses **bd** (beads) for all issue tracking and task management. Run `bd onboard` to get started.
**ALL** project work must be tracked as a `bd` issue. You must not execute work that isn't tracked in a beads issue.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
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

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues using `bd` for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work (`bd close <id>`), update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
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
