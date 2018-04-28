const dateFormat = require('dateformat');

dateFormat('dddd, mmmm dS, yyyy, HH:MM:ss');

exports.run = async (bot, msg, args) => {
  const id = msg.mentions.users.size > 0 ? msg.mentions.users.firstKey() : args[0];
  const member = id ? msg.channel.guild.members.find('id', id) : null;
  if (!member) return msg.reply('That user could not be found.');
  const userStats = await bot.database.getUserStats(member.user.id);
  const embed = new bot.discord.RichEmbed()
    .setTitle(member.user.tag)
    .setDescription(member.user.avatarURL ? `[Download avatar](${member.user.avatarURL})` : '')
    .setFooter(member.id)
    .setThumbnail(member.user.avatarURL)
    .addField('Status', member.presence.status, true)
    .addField('Game', member.presence.status.game ? member.presence.status.game.name : 'Not playing', true)
    .addField('Level', userStats.level, true)
    // .addField('Exp', `${userStats.exp}/${bot.Stats.formula(userStats.level + 1)}`, true)
    .addField('Points', userStats.points, true)
    .addField('Rank', userStats.rank, true)
    .addField('Created at', dateFormat(member.user.createdAt), true)
    .addField('Joined at', dateFormat(member.joinedAt), true)
    .addField('Roles', member.roles.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'None');
  await msg.channel.send({ embed });
};

exports.info = {
  name: 'fetch',
  description: 'Shows info about a user',
  usage: 'fetch <uid|@user>',
  level: ['Admin', 'Staff'],
};
