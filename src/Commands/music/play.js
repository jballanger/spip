exports.run = (bot, msg, args) => {
  let url = args[0];
  if (!url) throw new Error('Invalid url.');
  url = args.join(' ').replace('<', '').replace('>', '');
  const { voiceChannel } = msg.member;
  if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('You are not in a voice channel.');
  const permissions = voiceChannel.permissionsFor(bot.user);
  if (!permissions.has('CONNECT')) return msg.reply('I don\'t have permissions to join your voice channel.');
  if (!permissions.has('SPEAK')) return msg.reply('I don\'t have permissions to speak in your voice channel.');
  voiceChannel.join().then((connection) => {
    const data = {
      url,
      msg,
      connection,
      guildId: msg.channel.guild.id,
      textChannel: msg.channel,
    };
    bot.musicManager.addSong(data);
  });
};

exports.info = {
  name: 'play',
  description: 'Add a music to the queue and start playing',
  usage: 'play <youtube link | search>',
  level: [],
};
