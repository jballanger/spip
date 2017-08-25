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
	console.log(chalk.green(`\n${bot.user.username}#${bot.user.discriminator} ready !`));
});

bot.on('message', (msg) => {
	if (msg.author.id === bot.user.id) return ;
	if (!msg.content.startsWith(bot.commands.prefix)) bot.Stats.updateStats(msg);
	bot.commands.handleCommand(msg, msg.content);
});

bot.on('messageDelete', (msg) => {
	bot.deleted.set(msg.id, msg);
});

bot.on('warn', (err) => {
	console.error(`${chalk.yellow('WARN')}: ${err}`);
});

bot.on('shardDisconnect', (error, shard) => {
	console.error(chalk.red(`Shard ${shard} disconnected :`, error));
});

bot.hfeed.on('update', (data, i) => {
	bot.hfeed.channels.forEach((channel) => {
		let embed = new bot.discord.RichEmbed()
			.setTitle(data.title)
			.setDescription(bot.hfeed.messages[i])
			.setURL(data.link);
		channel.send({embed: embed});
	});
});

setInterval(() => {
	bot.refreshBotChannels();
}, 60000);