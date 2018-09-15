exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.reply('Please provide a feature.');
  const features = bot.features.map(f => f.toLowerCase());
  const index = features.indexOf(args[0].toLowerCase());
  if (index !== -1) {
    const feature = bot.features[index];
    const options = bot.utils.parser(args, msg.mentions);
    const result = await bot[feature].enable(msg.guild, options);
    return msg.reply(result);
  }
  return msg.reply(`No feature ${args[0]} available.`);
};

exports.info = {
  name: 'enable',
  description: 'Enable a specific feature',
  usage: 'enable <feature> [<options>]',
  level: ['Admin', 'Staff'],
};
