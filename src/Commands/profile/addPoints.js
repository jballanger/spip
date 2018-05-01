exports.run = async (bot, msg, args) => {
  if (msg.mentions.users.size < 1) return msg.reply('No user given.');
  const user = msg.mentions.users.first();
  const points = parseInt(args[1], 10);
  if (!points) return msg.reply('Invalid number of points');
  await bot.database.getUser(user, msg.channel.guild.id);
  const userStat = await bot.database.getUserStats(user.id);
  const newPoints = points + userStat.points;
  const row = await bot.database.models.Stats.model.update(
    { points: newPoints },
    { where: { uid: user.id } },
  );
  if (row[0] < 1) throw new Error(`${row[0]} rows were affected (${user.id})`);
  else return msg.reply(`<@${user.id}> got ${points} points.`);
};

exports.info = {
  name: 'addpoints',
  description: 'Add points to a user',
  usage: 'addpoints <@user> <points>',
  level: ['Admin', 'Staff'],
};
