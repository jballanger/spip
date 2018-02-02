exports.run = (bot, msg) => {
  const dispatcher = bot.musicManager.dispatcher.get(msg.channel.guild.id);
  dispatcher.end();
};

exports.info = {
  name: 'skip',
  description: 'Skip the current song',
  usage: 'skip',
  level: ['Admin', 'Staff'],
};
