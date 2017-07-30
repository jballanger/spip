process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

const chalk = require('chalk');

try {
	global._config = require('./config.json');
} catch (e) {
	console.error(chalk.red('Cannot find', chalk.bold('config.json'), '!\nPlease use', chalk.bold('config.struct.json'), 'to make your config.'));
	process.exit(1);
}

const DiscordClient = require('./Core/DiscordClient.js');

var bot = new DiscordClient();

bot.on('ready', async () => {
	await bot.commands.init(bot);
	bot.editStatus('online', bot.utils.game(_config.discord.game));
	console.log(chalk.green(`${bot.user.username}#${bot.user.discriminator} ready !`));
});

bot.on('messageCreate', (msg) => {
	bot.commands.handleCommand(msg, msg.content);
});

bot.on('messageDelete', (msg) => {
	bot.deleted.set(msg.id, msg);
});

bot.on('error', (err, shard) => {
	console.error(chalk.red(`${err} on shard ${shard}`));
});

bot.on('shardDisconnect', (error, shard) => {
	console.error(chalk.red(`Shard ${shard} disconnected :`, error.message));
});

bot.connect();