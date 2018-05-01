process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

global.Promise = require('bluebird');
global._config = require('../config.json');
const DiscordClient = require('./Core/DiscordClient.js');

const bot = new DiscordClient();

bot.on('warn', console.warn);
bot.on('error', console.error);
bot.on('ready', async () => {
  await bot.init();
  console.log(`\n${bot.user.username}#${bot.user.discriminator} ready !`);
});
