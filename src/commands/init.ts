import inquirer from 'inquirer';
import chalk from 'chalk';
import { ConfigManager } from '../lib/Config';
import { TemplateManager } from '../lib/TemplateManager';
import { Environment, Phase, AVAILABLE_PHASES, PHASE_DISPLAY_NAMES } from '../types';

interface InitOptions {
  environment?: Environment;
  all?: boolean;
  phases?: string;
}

export async function initCommand(options: InitOptions) {
  const configManager = new ConfigManager();
  const templateManager = new TemplateManager();

  // Check if already initialized
  if (await configManager.exists()) {
    const { shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: 'AI DevKit is already initialized. Do you want to reconfigure?',
        default: false
      }
    ]);

    if (!shouldContinue) {
      console.log(chalk.yellow('Initialization cancelled.'));
      return;
    }
  }

  // Determine environment
  let environment: Environment | undefined = options.environment;
  if (!environment) {
    const envAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'environment',
        message: 'Which AI development environment are you using?',
        choices: [
          { name: 'Cursor', value: 'cursor' },
          { name: 'Claude Code', value: 'claude' },
          { name: 'Both', value: 'both' }
        ]
      }
    ]);
    environment = envAnswer.environment;
  }

  // Determine which phases to initialize
  let selectedPhases: Phase[] = [];
  
  if (options.all) {
    selectedPhases = [...AVAILABLE_PHASES];
  } else if (options.phases) {
    selectedPhases = options.phases.split(',').map(p => p.trim()) as Phase[];
  } else {
    const phaseAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'phases',
        message: 'Which phases do you want to initialize? (or use --all flag)',
        choices: AVAILABLE_PHASES.map(phase => ({
          name: PHASE_DISPLAY_NAMES[phase],
          value: phase,
          checked: true
        }))
      }
    ]);
    selectedPhases = phaseAnswer.phases;
  }

  if (selectedPhases.length === 0) {
    console.log(chalk.yellow('No phases selected. Nothing to initialize.'));
    return;
  }

  console.log(chalk.blue('\nInitializing AI DevKit...\n'));

  // Create or update config
  await configManager.create(environment);
  console.log(chalk.green('✓ Created configuration file'));

  // Copy environment templates
  if (environment) {
    const envExists = await templateManager.environmentFilesExist(environment);
    let shouldCopyEnv = true;

    if (envExists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Environment configuration files already exist. Overwrite?`,
          default: false
        }
      ]);
      shouldCopyEnv = overwrite;
    }

    if (shouldCopyEnv) {
      const envFiles = await templateManager.copyEnvironmentTemplates(environment);
      envFiles.forEach(file => {
        console.log(chalk.green(`✓ Created ${file}`));
      });
    } else {
      console.log(chalk.yellow('⊘ Skipped environment configuration'));
    }
  }

  // Copy phase templates
  for (const phase of selectedPhases) {
    const exists = await templateManager.fileExists(phase);
    let shouldCopy = true;

    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${PHASE_DISPLAY_NAMES[phase]} already exists. Overwrite?`,
          default: false
        }
      ]);
      shouldCopy = overwrite;
    }

    if (shouldCopy) {
      const file = await templateManager.copyPhaseTemplate(phase);
      await configManager.addPhase(phase);
      console.log(chalk.green(`✓ Created ${phase} phase`));
    } else {
      console.log(chalk.yellow(`⊘ Skipped ${phase} phase`));
    }
  }

  console.log(chalk.green('\n✨ AI DevKit initialized successfully!\n'));
  console.log(chalk.blue('Next steps:'));
  console.log('  • Review and customize templates in docs/ai/');
  console.log('  • Use your AI development environment with the generated configuration');
  console.log('  • Run `ai-devkit phase <name>` to add more phases later\n');
}

