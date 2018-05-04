exports.run = async (bot, msg) => {
  const { guild } = msg;
  const guignols = bot.educator.guilds.get(msg.guild.id);
  if (!guignols) return msg.reply(`No Guignols found in ${guild.name}.`);
  const now = new Date();
  const embed = new bot.discord.RichEmbed({
    title: 'List of Guignols',
    color: bot.utils.randomColor(),
    timestamp: now,
    thumbnail: { url: 'https://gbf.wiki/images/9/9c/Stamp43.png' },
  });
  guignols.forEach((date, uid) => {
    const member = guild.members.find('id', uid);
    if (!member) return;
    let delta = Math.abs(date - now) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= (days * 86400);
    const hours = Math.floor(delta / 3600) % 24;
    delta -= (hours * 3600);
    const minutes = Math.floor(delta / 60) % 60;
    delta -= (minutes * 60);
    const seconds = Math.floor(delta % 60);
    const timeLeft = (`
      ${days > 0 ? `${days} day${days > 1 ? 's' : ''}, ` : ''}
      ${days > 0 || hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}
      ${days > 0 || hours > 0 || minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''},${seconds > 0 ? 'and ' : ''}` : ''}
      ${days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : ''}
    `).replace(/\s\s+/g, '')
      .replace(/,/g, ', ')
      .replace('and', 'and ');
    embed.addField(member.user.tag, timeLeft);
  });
  return (embed.fields.length > 0) ?
    msg.reply({ embed }) :
    msg.reply(`No Guignols found in ${guild.name}.`);
};

exports.info = {
  name: 'guignols',
  description: 'Display every \'Guignols\' in the current guild',
  usage: 'guignols',
  level: ['Admin', 'Staff'],
};
