<!-- 03ec012a-e67f-4be7-864b-04f986fd9f80 24ada56d-19db-4263-92bc-e63cb2045983 -->
# AI DevKit CLI Plan

## Project Setup

- Initialize Node + TypeScript project structure with `package.json`, `tsconfig.json`, npm scripts (`build`, `dev`, `lint`), and bin entry `ai-devkit`.
- Add core deps (`commander`, `inquirer`, `fs-extra`, `yaml`) and dev deps (`ts-node`, `@types/*`, `eslint` if needed).

## Template Resources

- Create `templates/phases/{requirements,design,planning,implementation,testing,deployment,monitoring}.md` using Markdown + YAML frontmatter for metadata and moderate guidance sections.
- Add `templates/env/cursor/rules/ai-devkit.md` and `templates/env/cursor/commands/*.md` per [Cursor documentation](https://cursor.com/docs/context/rules) (`.cursorrules` is deprecated).
- Add `templates/env/claude/workspace.md` with concise defaults.

## CLI Command Surface

- Implement `src/cli.ts` using Commander to register `init` and `phase <name>` commands plus `--all` option.
- Build interactive flows with Inquirer to gather environment choice, phases to scaffold, and overwrite confirmations when conflicts arise.

## Scaffolding Engine

- Add utilities in `src/lib/TemplateManager.ts` to resolve template paths, render frontmatter, and copy into target `docs/ai/<phase>/` or `.cursor/` directories.
- Copy Cursor templates to `.cursor/rules/` and `.cursor/commands/` (not deprecated `.cursorrules`).
- Implement `.ai-devkit.json` state management (`src/lib/Config.ts`) to track initialized phases and environments.
- Ensure overwrite prompts respect user choice (skip or replace) and log outcomes.

## Documentation & Distribution

- Document usage, commands, and template customization in `README.md`.
- Verify `npm run build` outputs `dist/` with shebang-compatible entry and test via `npx ai-devkit init --help`.

### Implementation Status

- [x] Initialize TypeScript Node project skeleton with configs, scripts, dependencies
- [x] Write phase and environment template files under templates/ directories
- [x] Develop CLI commands, interactive prompts, template copying, and config management
- [x] Update README with usage and ensure build outputs runnable CLI
- [x] Updated to use `.cursor/rules/` per latest Cursor documentation (not deprecated `.cursorrules`)

