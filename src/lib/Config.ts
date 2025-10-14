import * as fs from 'fs-extra';
import * as path from 'path';
import { DevKitConfig, Phase, Environment } from '../types';

const CONFIG_FILE_NAME = '.ai-devkit.json';

export class ConfigManager {
  private configPath: string;

  constructor(targetDir: string = process.cwd()) {
    this.configPath = path.join(targetDir, CONFIG_FILE_NAME);
  }

  async exists(): Promise<boolean> {
    return fs.pathExists(this.configPath);
  }

  async read(): Promise<DevKitConfig | null> {
    if (await this.exists()) {
      return fs.readJson(this.configPath);
    }
    return null;
  }

  async create(environment?: Environment): Promise<DevKitConfig> {
    const config: DevKitConfig = {
      version: '0.1.0',
      environment,
      initializedPhases: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fs.writeJson(this.configPath, config, { spaces: 2 });
    return config;
  }

  async update(updates: Partial<DevKitConfig>): Promise<DevKitConfig> {
    const config = await this.read();
    if (!config) {
      throw new Error('Config file not found. Run ai-devkit init first.');
    }

    const updated = {
      ...config,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await fs.writeJson(this.configPath, updated, { spaces: 2 });
    return updated;
  }

  async addPhase(phase: Phase): Promise<DevKitConfig> {
    const config = await this.read();
    if (!config) {
      throw new Error('Config file not found. Run ai-devkit init first.');
    }

    if (!config.initializedPhases.includes(phase)) {
      config.initializedPhases.push(phase);
      return this.update({ initializedPhases: config.initializedPhases });
    }

    return config;
  }

  async hasPhase(phase: Phase): Promise<boolean> {
    const config = await this.read();
    return config ? config.initializedPhases.includes(phase) : false;
  }
}

