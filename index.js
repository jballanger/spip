process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

global._config = require('./config.json');

const DiscordClient = require('./Core/DiscordClient.js');

var bot = new DiscordClient();

bot.on('ready', async () => {
	await bot.commands.init(bot);
	bot.editStatus('online', bot.utils.game(_config.discord.game));
	console.log(bot.user.username+'#'+bot.user.discriminator+' ready !');
});

bot.on('messageCreate', (msg) => {
	bot.commands.handleCommand(msg, msg.content);
});

bot.on('messageDelete', (msg) => {
	bot.deleted.set(msg.id, msg);
});

bot.connect();