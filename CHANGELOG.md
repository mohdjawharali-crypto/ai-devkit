# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-10-14

### Added
- Eight slash commands for Cursor and Claude Code:
  - `/new-requirement` - Complete guided workflow from requirements to PR/MR creation
  - `/code-review` - Structured local code reviews
  - `/execute-plan` - Walk feature plans task-by-task
  - `/writing-test` - Generate tests with guidance for 100% coverage
  - `/update-planning` - Reconcile progress with planning docs
  - `/check-implementation` - Compare implementation with design
  - `/review-design` - Review system design and architecture
  - `/review-requirements` - Review and summarize requirements
- Claude workspace configuration file (`CLAUDE.md`)
- Cursor rules file (`ai-devkit.md`)
- Design documentation requirements for mermaid diagrams (architecture and data flow)

## [0.1.0] - 2025-10-14

### Added
- Initial release of AI DevKit CLI
- Interactive `init` command for project initialization
- Support for Cursor and Claude Code environments
- Seven phase templates: requirements, design, planning, implementation, testing, deployment, monitoring
- `phase` command for adding individual phases
- Configuration management with `.ai-devkit.json`
- Template overwrite prompts for existing files
- Comprehensive documentation and README
- TypeScript support with full type definitions
- Cursor rules in `.cursor/rules/` directory
- Cursor slash commands as individual Markdown files in `.cursor/commands/`
- Claude Code workspace configuration in `CLAUDE.md`

### Features
- Interactive prompts with Inquirer
- Flag-based overrides for automation
- Markdown templates with YAML frontmatter
- Cursor rules and slash commands generation
- Claude Code workspace configuration
- State tracking for initialized phases

