# Deployment Policy – Treasure State Landing (Netlify)

This policy governs how code is deployed to production for the Treasure State Landing site, which is served by Netlify. It ensures deployments are safe, consistent, and traceable.

## 1. Source of Truth
- The GitHub repository is the canonical source for production deployments.
- All changes must be committed locally and pushed to GitHub before deployment.

## 2. Commit & Push Workflow
- Write clear, descriptive commit messages for every change.
- Never commit sensitive data (e.g., secrets, API keys, or `.env` files).
- Always pull the latest changes from GitHub before starting new work to avoid merge conflicts.
- Push all local commits to GitHub before deploying.

## 3. Review & Testing
- Test all changes locally before pushing.
- For major changes, use feature branches and submit pull requests for code review (even if self-review).
- Ensure all automated or manual tests pass before merging or deploying.

## 4. Netlify Deployment Steps
- Netlify is configured to deploy automatically from the main branch (or designated production branch) on GitHub.
- When new code is pushed to GitHub, Netlify detects the change and automatically builds and deploys the site.
- Never deploy uncommitted or unpushed changes.
- Use the Netlify dashboard to monitor build status and logs.
- If manual deploys are needed, use the Netlify UI or CLI (`netlify deploy`) and document the reason.

## 5. Rollback & Recovery
- Keep a record of deployment timestamps and commit SHAs.
- If a deployment causes issues, use Netlify's "Deploys" tab to roll back to a previous deploy or redeploy a stable commit.

## 6. Environment Awareness
- Never deploy test or mock data to production.
- Ensure all environment variables and Netlify site settings are correct before deployment.

## 7. Security & Compliance
- Do not expose sensitive files in the repository or during deployment.
- Regularly review `.gitignore`, Netlify environment settings, and repository access for security.

---

**Note:** All contributors and AI assistants must follow this policy for every deployment. Update this file as your deployment process evolves.
