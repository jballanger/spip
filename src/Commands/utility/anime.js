const chalk = require('chalk');
const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
  const search = args.join(' ');
  await bot.chinmei.searchSingleAnime(search).then(async (anime) => {
    if (!anime) throw new Error([42, 'That anime could not be found.']);

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
  }).catch((err) => {
    if (err[0] && err[0] === 42) {
      throw new Error(err[1]);
    } else {
      console.error(chalk.red(`Error while searching anime "${chalk.underline(search)}".\n${err}`));
      throw new Error('Something wrong happened, please contact an Admin.');
    }
  });
};

exports.info = {
  name: 'anime',
  description: 'Get details of an anime from MyAnimeList',
  usage: 'anime <search>',
  level: [],
};