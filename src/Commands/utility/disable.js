exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.reply('Please provide a feature.');
  const features = bot.features.map(f => f.toLowerCase());
  const index = features.indexOf(args[0].toLowerCase());
  if (index !== -1) {
    const feature = bot.features[index];
    const result = await bot[feature].disable(msg.guild);
    return msg.reply(result);
  }
  return msg.reply(`No feature ${args[0]} available.`);
};

exports.info = {
  name: 'disable',
  description: 'Disable a specific feature',
  usage: 'disable <feature>',
  level: ['Admin'],
};
