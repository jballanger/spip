exports.run = (bot, msg, args) => {
  if (msg.mentions.users.size < 1) return msg.reply('No user given.');
  const user = msg.mentions.users.first();
  const level = parseInt(args[1], 10);
  if (!level) return msg.reply('Invalid level');
  bot.database.models.User.model.update({
    level,
  }, {
    where: {
      uid: user.id,
      gid: msg.channel.guild.id,
    },
  }).then((row) => {
    if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
    else msg.reply(`<@${user.id}>'s level is now ${level}`);
  });
};

exports.info = {
  name: 'setlevel',
  description: 'Change the level of a user',
  usage: 'setlevel <@user> <level>',
  level: ['Admin', 'Staff'],
};
