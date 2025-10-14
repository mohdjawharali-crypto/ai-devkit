import * as fs from 'fs-extra';
import * as path from 'path';
import { Phase, Environment } from '../types';

export class TemplateManager {
  private templatesDir: string;
  private targetDir: string;

  constructor(targetDir: string = process.cwd()) {
    // Templates are in the package directory, not the target directory
    this.templatesDir = path.join(__dirname, '../../templates');
    this.targetDir = targetDir;
  }

  async copyPhaseTemplate(phase: Phase): Promise<string> {
    const sourceFile = path.join(this.templatesDir, 'phases', `${phase}.md`);
    const targetDir = path.join(this.targetDir, 'docs', 'ai', phase);
    const targetFile = path.join(targetDir, 'README.md');

    await fs.ensureDir(targetDir);
    await fs.copy(sourceFile, targetFile);

    return targetFile;
  }

  async copyEnvironmentTemplates(environment: Environment): Promise<string[]> {
    const copiedFiles: string[] = [];

    if (environment === 'cursor' || environment === 'both') {
      const cursorFiles = await this.copyCursorTemplates();
      copiedFiles.push(...cursorFiles);
    }

    if (environment === 'claude' || environment === 'both') {
      const claudeFiles = await this.copyClaudeTemplates();
      copiedFiles.push(...claudeFiles);
    }

    return copiedFiles;
  }

  private async copyCursorTemplates(): Promise<string[]> {
    const files: string[] = [];

    // Copy rules to .cursor/rules directory (new format, .cursorrules is deprecated)
    const rulesSourceDir = path.join(this.templatesDir, 'env', 'cursor', 'rules');
    const rulesTargetDir = path.join(this.targetDir, '.cursor', 'rules');
    await fs.ensureDir(rulesTargetDir);
    await fs.copy(rulesSourceDir, rulesTargetDir);
    
    // List all rule files for feedback
    const ruleFiles = await fs.readdir(rulesSourceDir);
    ruleFiles.forEach(file => {
      files.push(path.join(rulesTargetDir, file));
    });

    // Copy slash commands to .cursor/commands directory
    const commandsSourceDir = path.join(this.templatesDir, 'env', 'cursor', 'commands');
    const commandsTargetDir = path.join(this.targetDir, '.cursor', 'commands');
    await fs.ensureDir(commandsTargetDir);
    await fs.copy(commandsSourceDir, commandsTargetDir);
    
    // List all command files for feedback
    const commandFiles = await fs.readdir(commandsSourceDir);
    commandFiles.forEach(file => {
      files.push(path.join(commandsTargetDir, file));
    });

    return files;
  }

  private async copyClaudeTemplates(): Promise<string[]> {
    const files: string[] = [];

    // Copy Claude workspace config
    const workspaceSource = path.join(this.templatesDir, 'env', 'claude', 'CLAUDE.md');
    const workspaceDir = path.join(this.targetDir, '.claude');
    const workspaceTarget = path.join(workspaceDir, 'CLAUDE.md');
    await fs.ensureDir(workspaceDir);
    await fs.copy(workspaceSource, workspaceTarget);
    files.push(workspaceTarget);

    // Copy Claude commands
    const commandsSourceDir = path.join(this.templatesDir, 'env', 'claude', 'commands');
    const commandsTargetDir = path.join(this.targetDir, '.claude', 'commands');
    await fs.ensureDir(commandsTargetDir);
    await fs.copy(commandsSourceDir, commandsTargetDir);
    
    // List all command files for feedback
    const commandFiles = await fs.readdir(commandsSourceDir);
    commandFiles.forEach(file => {
      files.push(path.join(commandsTargetDir, file));
    });

    return files;
  }

  async fileExists(phase: Phase): Promise<boolean> {
    const targetFile = path.join(this.targetDir, 'docs', 'ai', phase, 'README.md');
    return fs.pathExists(targetFile);
  }

  async environmentFilesExist(environment: Environment): Promise<boolean> {
    if (environment === 'cursor' || environment === 'both') {
      const rulesExists = await fs.pathExists(path.join(this.targetDir, '.cursor', 'rules'));
      if (rulesExists) return true;
    }

    if (environment === 'claude' || environment === 'both') {
      const workspaceExists = await fs.pathExists(path.join(this.targetDir, '.claude', 'CLAUDE.md'));
      if (workspaceExists) return true;
    }

    return false;
  }
}

