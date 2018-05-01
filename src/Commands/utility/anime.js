const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
  const search = args.join(' ');
  const anime = await bot.chinmei.searchSingleAnime(search);
  if (!anime) return msg.reply('That anime could not be found.');
  const synopsis = htmlToText.fromString(anime.synopsis, {
    ignoreHref: true,
  }).replace(/\[(.+?)\]/g, '').replace(/\n/g, ' ');
  const embed = new bot.discord.RichEmbed()
    .setTitle(anime.title)
    .setDescription(anime.english.length > 0 ? `(${anime.english})` : '')
    .setURL(`https://myanimelist.net/anime/${anime.id}/`)
    .setThumbnail(anime.image)
    .setFooter('MyAnimeList', 'https://myanimelist.cdn-dena.com/images/faviconv5.ico')
    .addField('Episodes', anime.episodes === 0 ? 'Unknow' : anime.episodes, true)
    .addField('Type', anime.type, true)
    .addField('Status', anime.status, true)
    .addField('Score', anime.score, true)
    .addField('Start date', anime.start_date, true)
    .addField('End date', anime.end_date === '0000-00-00' ? 'Unknow' : anime.end_date, true)
    .addField('Synopsis', `${synopsis.substr(0, 500)}${synopsis.length > 500 ? '[...]' : ''}`);
  await msg.channel.send({ embed });
};

exports.info = {
  name: 'anime',
  description: 'Get details of an anime from MyAnimeList',
  usage: 'anime <search>',
  level: [],
};
