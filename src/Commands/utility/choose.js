exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.reply('Please provide at least one choice.');
  const choices = args.join(' ').split('|');
  const n = bot.utils.randomNumber(0, choices.length);
  await msg.channel.send(choices[n].trim());
};

exports.info = {
  name: 'choose',
  description: 'Makes a choice for you',
  usage: 'choose <foo|bar|...>',
  level: [],
};
