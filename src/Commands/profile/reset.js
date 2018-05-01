exports.run = async (bot, msg) => {
  if (msg.mentions.users.size < 1) return msg.reply('Invalid user');
  const user = msg.mentions.users.first();
  const row = await bot.database.models.User.model.destroy({
    where: {
      uid: user.id,
      gid: msg.channel.guild.id,
    },
  });
  if (row[0] > 1) throw new Error(`${row[0]} rows were affected (${user.id})`);
  else return msg.reply(`${user.username} successfully reset.`);
};

exports.info = {
  name: 'reset',
  description: 'Reset user\'s stats',
  usage: 'reset <@user>',
  level: ['Admin', 'Staff'],
};
