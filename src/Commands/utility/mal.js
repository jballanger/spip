exports.run = (bot, msg, args) => {
  if (!args[0]) return msg.reply('No user given.');
  const p1 = bot.chinmei.getMalUser(args[0], 1);
  const p2 = bot.chinmei.getMalUser(args[0], 2);
  return Promise.all([p1, p2]).then(async (malUser) => {
    const u1 = malUser[0].myinfo;
    const u2 = malUser[1].myinfo;
    const embed = new bot.discord.RichEmbed()
      .setTitle(u1.user_name)
      .setDescription('MyAnimeList Infos')
      .setURL(`https://myanimelist.net/profile/${u1.user_name}`)
      .setFooter(u1.user_id, 'https://myanimelist.cdn-dena.com/images/faviconv5.ico')
      .setThumbnail(`https://myanimelist.cdn-dena.com/images/userimages/${u1.user_id}.jpg`)
      .addField('Watching', u1.user_watching, true)
      .addField('Reading', u2.user_reading, true)
      .addField('Anime completed', u1.user_completed, true)
      .addField('Manga completed', u2.user_completed, true)
      .addField('Anime on hold', u1.user_onhold, true)
      .addField('Manga on hold', u2.user_onhold, true)
      .addField('Anime dropped', u1.user_dropped, true)
      .addField('Manga dropped', u2.user_dropped, true)
      .addField('Plan to watch', u1.user_plantowatch, true)
      .addField('Plan to read', u2.user_plantoread, true);
    await msg.channel.send({ embed });
  }).catch(() => {
    return msg.reply('User not found.');
  });
};

exports.info = {
  name: 'mal',
  description: 'Get informations about a MyAnimeList user',
  usage: 'mal <user>',
  level: [],
};
