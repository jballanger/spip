exports.run = (bot, msg) => {
  if (msg.mentions.users.size < 1) throw new Error('Invalid user');
  const user = msg.mentions.users.first();
  bot.database.models.User.model.destroy({
    where: {
      uid: user.id,
      gid: msg.channel.guild.id,
    },
  }).then((row) => {
    if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
    else msg.reply(`${user.username} successfully reset.`);
  });
};

exports.info = {
  name: 'reset',
  description: 'Reset user\'s stats',
  usage: 'reset <@user>',
  level: ['Admin', 'Staff'],
};
