exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.reply('Please provide a feature.');
  const feature = args[0];
  const features = bot.features.map(f => f.toLowerCase());
  const index = features.indexOf(feature.toLowerCase());
  if (index !== -1) {
    const featureName = bot.features[index];
    const options = bot.utils.parser(args);
    const featureSettings = bot[featureName].settings(options);
    if (!featureSettings) return msg.reply('Invalid argument(s)');
    const result = await bot[featureName].enable(msg.guild, featureSettings);
    return msg.reply(result);
  }
  return msg.reply(`No feature ${feature} available.`);
};

exports.info = {
  name: 'enable',
  description: 'Enable a specific feature',
  usage: 'enable <feature>',
  level: ['Admin', 'Staff'],
};
