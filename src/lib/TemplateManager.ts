import * as fs from 'fs-extra';
import * as path from 'path';
import { Phase, Environment } from '../types';

export class TemplateManager {
  private templatesDir: string;
  private targetDir: string;

  constructor(targetDir: string = process.cwd()) {
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

    const workspaceSource = path.join(this.templatesDir, 'env', 'cursor', 'AGENTS.md');
    const workspaceTarget = path.join(this.targetDir, 'AGENTS.md');
    await fs.copy(workspaceSource, workspaceTarget);
    files.push(workspaceTarget);

    const rulesSourceDir = path.join(this.templatesDir, 'env', 'cursor', 'rules');
    const rulesTargetDir = path.join(this.targetDir, '.cursor', 'rules');
    await fs.ensureDir(rulesTargetDir);
    await fs.copy(rulesSourceDir, rulesTargetDir);
    
    const ruleFiles = await fs.readdir(rulesSourceDir);
    ruleFiles.forEach(file => {
      files.push(path.join(rulesTargetDir, file));
    });

    const commandsSourceDir = path.join(this.templatesDir, 'commands');
    const commandsTargetDir = path.join(this.targetDir, '.cursor', 'commands');
    await fs.ensureDir(commandsTargetDir);
    await fs.copy(commandsSourceDir, commandsTargetDir);
    
    const commandFiles = await fs.readdir(commandsSourceDir);
    commandFiles.forEach(file => {
      files.push(path.join(commandsTargetDir, file));
    });

    return files;
  }

  private async copyClaudeTemplates(): Promise<string[]> {
    const files: string[] = [];

    const workspaceSource = path.join(this.templatesDir, 'env', 'claude', 'CLAUDE.md');
    const workspaceTarget = path.join(this.targetDir, 'CLAUDE.md');
    await fs.copy(workspaceSource, workspaceTarget);
    files.push(workspaceTarget);

    const commandsSourceDir = path.join(this.templatesDir, 'commands');
    const commandsTargetDir = path.join(this.targetDir, '.claude', 'commands');
    await fs.ensureDir(commandsTargetDir);
    await fs.copy(commandsSourceDir, commandsTargetDir);
    
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

