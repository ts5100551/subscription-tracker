# Repository Guidelines

## Project Structure & Module Organization
- `myNote.md` contains the product plan, tech stack notes, and feature requirements.
- Source code is not present yet. When added, keep application code under `src/`, tests under `tests/` (or `src/__tests__/`), and assets under `public/` or `assets/`.

## Build, Test, and Development Commands
- No build or test scripts are defined in this repository yet.
- When tooling is introduced, document commands here (for example: `bun install`, `bun dev`, `bun test`).

## Coding Style & Naming Conventions
- Use 2-space indentation for JSON/YAML and 2 or 4 spaces for TypeScript/JavaScript (be consistent within a file).
- Prefer `camelCase` for variables/functions and `PascalCase` for React components.
- Use `kebab-case` for file and folder names (for example: `subscription-list.tsx`).
- If linting/formatting tools (e.g., ESLint, Prettier) are added, follow their defaults and include configs in the repo.

## Testing Guidelines
- Testing frameworks are not set up yet.
- When tests exist, name files with `.test.ts` or `.spec.ts` and colocate with the feature or under `tests/`.
- Ensure tests cover core flows: authentication, CRUD on subscriptions, billing date logic, and analytics calculations.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `type(scope): summary` (imperative, <= 72 chars).
- Include a bullet list body describing motivation, key changes, and validation steps.
- PRs should include: a clear summary, key changes, test steps, and screenshots for UI changes.

## Security & Configuration Tips
- Keep secrets (API keys, Supabase credentials) out of the repo. Use `.env` files and document required variables in `README.md` or a dedicated `env.example`.
- Do not commit user data or production exports.
