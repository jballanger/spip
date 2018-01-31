const chalk = require('chalk');
const path = require('path');

class CommandManager {
  constructor() {
    this.bot = null;
    this.commands = [];
    this.channels = [];
    this.prefix = _config.discord.prefix;
  }

  async init(bot) {
    this.bot = bot;
    console.log(chalk.yellow('Loading commands..'));
    await this.loadCommands();
    console.log(chalk.blue(`${this.commands.length} commands loaded !`));
    await this.listCommands();
  }

  get(name) {
    return (this.commands.find(c => c.info.name === name));
  }

  static sortCommands(a, b) {
    return (a.info.level.length - b.info.level.length);
  }

  async listCommands() {
    await this.commands.sort(this.constructor.sortCommands);
    this.channels.forEach(async (channel) => {
      let content = '';
      let currentLevel = null;
      await this.commands.forEach((command) => {
        if (!currentLevel || (currentLevel !== command.info.level.join(', ') && currentLevel !== 'General')) {
          if (command.info.level.length < 1) currentLevel = 'General';
          else currentLevel = command.info.level.join(', ');
          content += `\n**[${currentLevel}]** commands\n`;
        }
        content += `__${command.info.name}__ - ${command.info.description}\n`;
      });
      channel.fetchMessages({ limit: 1 }).then((messages) => {
        const message = messages.first();
        if (message && message.author.id === this.bot.user.id) {
          message.edit(content);
        } else channel.send(content);
      });
    });
  }

  loadCommands() {
    const { bot } = this;

    const commandsImport = bot.importManager.getImport('../Commands');
    Object.keys(commandsImport).forEach((file) => {
      const command = commandsImport[file];
      const name = path.basename(file);
      this.validateAndLoad(command, file, name);
    });
  }

  static validate(object) {
    if (typeof object !== 'object') {
      return 'command is not an object';
    }
    if (typeof object.run !== 'function') {
      return 'run function is missing';
    }
    if (typeof object.info !== 'object') {
      return 'object info is missing';
    }
    if (typeof object.info.name !== 'string') {
      return 'object info is missing a valid name field';
    }
    if (typeof object.info.usage !== 'string') {
      return 'object info is missing a valid usage field';
    }
    if (typeof object.info.description !== 'string') {
      return 'object info is missing a valid description field';
    }
    if (typeof object.info.level !== 'object') {
      return 'object info is missing a valid level field';
    }
    return null;
  }

  validateAndLoad(command, file, name) {
    const error = this.constructor.validate(command);

    if (error) {
      return console.error(chalk.yellow(`Failed to load ${name}\n${error}`));
    }
    return (this.commands.push(command));
  }

  handleCommand(msg, input) {
    if (!input.startsWith(this.prefix) || !msg.channel.guild) return;

    const split = input.substr(this.prefix.length).trim().split(' ');
    const base = split[0].toLowerCase();
    const args = split.slice(1);

    const command = this.get(base);
    if (command) {
      const levelRequired = command.info.level;
      if (levelRequired.length > 0) {
        if (!levelRequired.some(e => msg.member.roles.exists('name', e))) {
          msg.reply(levelRequired.length > 1
            ? `One of the following roles are required to use ${this.prefix}${base}.\n(${levelRequired.map(a => `**${a}**`).join(', ')})`
            : `**${levelRequired[0]}** are required to use ${this.prefix}${base}.`);
          return;
        }
      }
      this.execute(msg, command, args);
    }
  }

  async execute(msg, command, args) {
    try {
      return await command.run(this.bot, msg, args);
    } catch (err) {
      msg.reply(err);
      return null;
    }
  }
}

module.exports = CommandManager;
