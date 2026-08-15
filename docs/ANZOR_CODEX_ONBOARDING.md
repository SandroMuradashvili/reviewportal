# ReviewPortal: Codex onboarding for Anzor

This guide explains how to work on ReviewPortal in parallel without changing the production application or another developer's work.

## 1. Get access

Before starting, make sure you have:

- Accepted the GitHub invitation to `SandroMuradashvili/reviewportal`.
- Joined the Convex team using `papunadatunashvili2@gmail.com` with the **Developer** role.
- Installed Git, Node.js, npm, and Codex.

Vercel access is not required for normal development. The project owner manages production deployments because the current Vercel team is on the Hobby plan.

## 2. Clone and install

```bash
git clone https://github.com/SandroMuradashvili/reviewportal.git
cd reviewportal
npm install
```

Open this directory in Codex. Codex must read and follow the repository's `AGENTS.md` before editing code.

## 3. Connect your own Convex development deployment

Log in with your own Convex account:

```bash
npx convex login
npx convex dev
```

When prompted, select:

- Team: `smuradashvili's team`
- Existing project: `reviewportal-18c16`
- Development deployment: your personal development deployment

Convex should generate a local `.env.local` pointing to your personal dev deployment. Never commit `.env.local`, access tokens, deploy keys, or production credentials.

Do not run `npx convex deploy`. That command updates the shared production backend.

## 4. Create a branch for every task

Update `main` before starting:

```bash
git switch main
git pull --ff-only origin main
git switch -c anzor/short-task-name
```

Examples:

```text
anzor/dashboard-filters
anzor/mobile-navigation
anzor/feedback-validation
```

Never work directly on `main` and never force-push shared branches.

## 5. Start development

Run Convex in one terminal:

```bash
npx convex dev
```

Run Next.js in another terminal:

```bash
npm run dev
```

Use only your personal Convex deployment while developing. Do not change Vercel production variables or production Convex data.

## 6. Instructions to give Codex

Paste the following at the beginning of a Codex task:

```text
You are working on ReviewPortal in my feature branch.

Before editing:
1. Read AGENTS.md and the relevant local Next.js 16 documentation in node_modules/next/dist/docs/.
2. Inspect git status and preserve all existing changes.
3. Confirm that I am not on main. Do not switch branches if there are uncommitted changes.
4. Use my personal Convex dev deployment only.

While working:
- Do not run `npx convex deploy`.
- Do not modify Vercel production settings.
- Do not commit .env files, tokens, credentials, or generated secrets.
- Keep changes limited to the requested task.
- Do not overwrite or revert another developer's work.
- Run typecheck, lint, tests, and a production build when relevant.

When finished:
- Summarize the files changed and checks run.
- Show me git status.
- Do not merge to main or deploy production unless I explicitly request it.
```

Then describe the specific task beneath that prompt.

## 7. Verify work before pushing

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If a command fails, fix failures caused by your changes. Do not hide errors by disabling TypeScript, ESLint, or tests.

Review the changes:

```bash
git status --short
git diff
```

## 8. Commit and open a pull request

```bash
git add <files-you-intentionally-changed>
git commit -m "Describe the completed change"
git push -u origin anzor/short-task-name
```

Open a pull request into `main`. Include:

- What changed.
- Why it changed.
- How it was tested.
- Screenshots for visible UI changes.
- Any schema, environment-variable, or migration considerations.

The project owner reviews and merges the pull request. Merging `main` triggers the production Vercel workflow; production Convex changes must be coordinated separately.

## 9. Stay synchronized

Before continuing work on a long-running branch:

```bash
git fetch origin
git rebase origin/main
```

If conflicts appear, inspect them carefully. Ask before resolving a conflict when the intended behavior is unclear.

## Production safety summary

- GitHub feature branch: safe for normal work.
- Personal Convex dev deployment: safe for backend development and test data.
- `main`: shared and production-bound; modify through reviewed pull requests.
- Convex production: shared; never deploy without explicit coordination.
- Vercel production: managed by the project owner.
- Secrets and `.env.local`: private and never committed.
