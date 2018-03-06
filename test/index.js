global.Promise = require('bluebird');
global._config = require('../src/config.json');
const assert = require('assert');
const chalk = require('chalk');
const DiscordClient = require('../src/Core/DiscordClient.js');

const bot = new DiscordClient();

const img1 = 'http://img04.deviantart.net/793d/i/2016/009/e/1/background_anime_1_by_al00ndr44-d9nd73s.png';
const img2 = 'https://s-media-cache-ak0.pinimg.com/originals/6c/d3/ca/6cd3cab620096278d6c7495910661a5c.png';
const img3 = 'http://orig08.deviantart.net/fe76/f/2015/131/2/c/anime_school__6_by_shamelessbeauty3-d8szdgt.png';

bot.on('ready', async () => {
  await bot.init();
  const loadImageUrl = await bot.utils.loadImageUrl(img1, img2, img3);
  console.log(loadImageUrl);
});