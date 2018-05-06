exports.run = async (bot, msg, args) => {
  if (msg.mentions.users.size < 1) return msg.reply('No user given.');
  const user = msg.mentions.users.first();
  const level = parseInt(args[1], 10);
  if (!level) return msg.reply('Invalid level');
  const row = await bot.database.models.Stats.model.update(
    { level },
    { where: { uid: user.id } },
  );
  if (row[0] < 1) throw new Error(`${row[0]} rows were affected (${user.id})`);
  else return msg.reply(`<@${user.id}>'s level is now ${level}`);
};

exports.info = {
  name: 'setlevel',
  description: 'Change the level of a user',
  usage: 'setlevel <@user> <level>',
  level: ['Admin', 'Staff'],
};
