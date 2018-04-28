exports.run = (bot, msg, args) => {
  if (msg.mentions.users.size < 1) return msg.reply('No user given.');
  const user = msg.mentions.users.first();
  const points = parseInt(args[1], 10);
  if (!points) return msg.reply('Invalid number of points');
  bot.database.models.User.model.update({
    points,
  }, {
    where: {
      uid: user.id,
      gid: msg.channel.guild.id,
    },
  }).then((row) => {
    if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
    else msg.reply(`<@${user.id}> now got ${points} points.`);
  });
};

exports.info = {
  name: 'setpoints',
  description: 'Change the number of points a user have',
  usage: 'setpoints <@user> <points>',
  level: ['Admin'],
};
