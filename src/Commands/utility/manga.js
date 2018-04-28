const chalk = require('chalk');
const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
  const search = args.join(' ');
  const manga = await bot.chinmei.searchSingleManga(search);
  if (!manga) return msg.reply('That manga could not be found.');
  const synopsis = htmlToText.fromString(manga.synopsis, {
    ignoreHref: true,
  }).replace(/\[(.+?)\]/g, '').replace(/\n/g, ' ');
  const embed = new bot.discord.RichEmbed()
    .setTitle(manga.title)
    .setDescription(manga.english.length > 0 ? `(${manga.english})` : '')
    .setURL(`https://myanimelist.net/manga/${manga.id}/`)
    .setThumbnail(manga.image)
    .setFooter('MyAnimeList', 'https://myanimelist.cdn-dena.com/images/faviconv5.ico')
    .addField('Chapters', manga.chapters === '0' ? 'Unknow' : manga.chapters, true)
    .addField('Volumes', manga.volumes === '0' ? 'Unknow' : manga.volumes, true)
    .addField('Status', manga.status, true)
    .addField('Score', manga.score, true)
    .addField('Start date', manga.start_date, true)
    .addField('End date', manga.end_date === '0000-00-00' ? 'Unknow' : manga.end_date, true)
    .addField('Synopsis', `${synopsis.substr(0, 500)}${synopsis.length > 500 ? '[...]' : ''}`);
  await msg.channel.send({ embed });
};

exports.info = {
  name: 'manga',
  description: 'Get details of a manga from MyAnimeList',
  usage: 'manga <search>',
  level: [],
};
