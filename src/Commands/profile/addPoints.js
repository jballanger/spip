exports.run = async (bot, msg, args) => {
  if (msg.mentions.users.size < 1) return msg.reply('No user given.');
  const user = msg.mentions.users.first();
  const points = parseInt(args[1], 10);
  if (!points) return msg.reply('Invalid number of points');
  const userStat = await bot.database.getUserStats(user.id);
  const newPoints = points + userStat.points;
  bot.database.models.Stats.model.update({
    points: newPoints,
  }, {
    where: {
      uid: user.id,
    },
  }).then((row) => {
    if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
    else msg.reply(`<@${user.id}> got ${points} points.`);
  });
};

exports.info = {
  name: 'addpoints',
  description: 'Add points to a user',
  usage: 'addpoints <@user> <points>',
  level: ['Admin', 'Staff'],
};
