process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

const chalk = require('chalk');

global.Promise = require('bluebird');
try {
	global._config = require('./config.json');
} catch (e) {
	console.error(chalk.red(chalk.bold('config.json'), 'is either non-existent or invalid !\nPlease use', chalk.bold('config.struct.json'), 'to make your config.'));
	process.exit(1);
}

const DiscordClient = require('./Core/DiscordClient.js');

var bot = new DiscordClient();

bot.on('ready', async () => {
	await bot.init();
	await bot.commands.init(bot);
	await bot.Stats.expTable();
	console.log(chalk.green(`\n${bot.user.username}#${bot.user.discriminator} ready !`));
});

bot.on('messageCreate', (msg) => {
	if (msg.author.id === bot.user.id) return ;
	if (!msg.content.startsWith(this.commands.prefix)) bot.Stats.updateStats(msg);
	bot.commands.handleCommand(msg, msg.content);
});

bot.on('messageDelete', (msg) => {
	bot.deleted.set(msg.id, msg);
});

bot.on('error', (err, shard) => {
	console.error(chalk.red(`${err} on shard ${shard}`));
});

bot.on('shardDisconnect', (error, shard) => {
	console.error(chalk.red(`Shard ${shard} disconnected :`, error));
});

bot.hfeed.on('update', (data, i) => {
	bot.hfeed.channels.forEach((channel) => {
		bot.createMessage(channel.id, {
			embed: bot.utils.embed(
				data.title,
				bot.hfeed.messages[i],
				[],
				{url: data.link}
			)
		});
	});
});

setInterval(() => {
	bot.refreshBotChannels();
}, 60000);

bot.connect();
