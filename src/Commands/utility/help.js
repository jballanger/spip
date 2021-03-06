exports.run = async (bot, msg, args) => {
  const command = bot.commands.get(args[0] || 'help');
  if (!command) return msg.reply(`No command \`${args[0]}\` were found.`);
  const embed = new bot.discord.RichEmbed()
    .setTitle(`Help for ${command.info.name}`)
    .setColor(7228979)
    .addField('Usage', `${_config.discord.prefix}${command.info.usage}`)
    .addField('Description', command.info.description)
    .addField('Role required', command.info.level.length > 0 ? `One of ${command.info.level.map(a => `**${a}**`).join(', ')}` : 'None');
  return msg.channel.send({ embed });
};

exports.info = {
  name: 'help',
  description: 'Display the help of a command',
  usage: 'help <command>',
  level: [],
};
