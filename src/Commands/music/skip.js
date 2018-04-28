exports.run = (bot, msg) => {
  const { voiceChannel } = msg.member;
  if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('You are not in a voice channel.');
  const dispatcher = bot.musicManager.dispatcher.get(msg.channel.guild.id);
  dispatcher.end();
};

exports.info = {
  name: 'skip',
  description: 'Skip the current song',
  usage: 'skip',
  level: [],
};
