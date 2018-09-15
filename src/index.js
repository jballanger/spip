process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

global.Promise = require('bluebird');
global._config = require('../config.json');
const DiscordClient = require('./Core/DiscordClient.js');

const bot = new DiscordClient();

bot.on('warn', (e) => {
  console.log('warn', e);
});
bot.on('error', (e) => {
  console.log('error', e);
});
bot.on('disconnect', (e) => {
  console.log('disconnect', e);
});
bot.on('reconnecting', () => console.log('reconnecting'));
bot.on('resume', (e) => {
  console.log('resume', e);
});
bot.on('ready', async () => {
  await bot.init();
});
