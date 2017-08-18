const chalk = require('chalk');

class CommandManager {
	constructor(bot) {
		this.bot = null;
		this.commands = [];
		this.prefix = _config.discord.prefix;
	}
	
	async init(bot) {
		this.bot = bot;
		console.log(chalk.yellow('Loading commands..'));
		await this.loadCommands();
		console.log(chalk.blue(`${this.commands.length} commands loaded !`));
	}

	get(name) {
		return this.commands.find(c => c.info['name'] === name);
	}

	loadCommands() {
		const bot = this.bot;

		const commandsImport = bot.importManager.getImport('../Commands');
		Object.keys(commandsImport).forEach(file => {
			let command = commandsImport[file];
			let name = path.basename(file);
			this.validateAndLoad(command, file, name);
		});
	}

	validate(object) {
		if (typeof object !== 'object')
			return 'command is not an object';
		if (typeof object.run !== 'function')
			return 'run function is missing';
		if (typeof object.info !== 'object')
			return 'object info is missing';
		if (typeof object.info.name !== 'string')
			return 'object info is missing a valid name field';
		if (typeof object.info.usage !== 'string')
			return 'object info is missing a valid usage field';
		if (typeof object.info.description !== 'string')
			return 'object info is missing a valid description field';
		if (typeof object.info.level !== 'object')
			return 'object info is missing a valid level field';
		return null;
	}

	validateAndLoad(command, file, name) {
		let error = this.validate(command);

		if (error) {
			return console.error(chalk.yellow(`Failed to load ${name}\n${error}`));
		}
		this.commands.push(command);
	}

	handleCommand(msg, input) {
		if (!input.startsWith(this.prefix) || !msg.channel.guild) return;

		let split = input.substr(this.prefix.length).trim().split(' ');
		let base = split[0].toLowerCase();
		let args = split.slice(1);

		let command = this.get(base);
		if (command) {
			let levelRequired = command.info.level;
			if (levelRequired.length > 0) {
				if (!this.bot.utils.findOne(levelRequired, msg.member.roles)) {
					msg.reply(levelRequired.length > 1
								? `<@${msg.author.id}> One of the following roles are required to use ${this.prefix}${base}.\n(${levelRequired.map(a => '**'+a+'**').join(', ')})`
								: `<@${msg.author.id}> **${levelRequired[0]}** are required to use ${this.prefix}${base}.`
					);
					return null;
				}
			}
			return this.execute(msg, command, args);
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