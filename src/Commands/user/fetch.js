const dateFormat = require('dateformat');

dateFormat('dddd, mmmm dS, yyyy, HH:MM:ss');

exports.run = async (bot, msg, args) => {
  const id = msg.mentions.users.size > 0 ? msg.mentions.users.firstKey() : args[0];
  const member = id ? msg.channel.guild.members.find('id', id) : null;
  if (!member) return msg.reply('That user could not be found.');
  const { user } = member;
  const userData = await user.data.get();
  const userLevel = bot.stats.getLevel(userData.exp);
  const embed = new bot.discord.RichEmbed()
    .setTitle(user.tag)
    .setDescription(user.avatarURL ? `[Download avatar](${user.avatarURL})` : '')
    .setFooter(user.id)
    .setThumbnail(user.avatarURL)
    .addField('Status', bot.utils.ucfirst(member.presence.status), true)
    .addField('Game', (member.presence.game) ? member.presence.game.name : 'Not playing', true)
    .addField('Level', userLevel, true)
    .addField('Exp', `${userData.exp} / ${bot.stats.getLevelExp(userLevel + 1)}`, true)
    .addField('Points', userData.points, true)
    .addField('Rank', bot.stats.getRank(msg.guild.id, user.id), true)
    .addField('Created at', dateFormat(user.createdAt), true)
    .addField('Joined at', dateFormat(member.joinedAt), true)
    .addField('Roles', member.roles.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'None');
  return msg.channel.send({ embed });
};

exports.info = {
  name: 'fetch',
  description: 'Shows info about a user',
  usage: 'fetch <uid|@user>',
  level: ['Admin', 'Staff'],
};
