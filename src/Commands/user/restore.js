exports.run = async (bot, msg) => {
  const user = msg.mentions[0];
  if (!user) {
    return msg.reply('Please mention the user you want the messages restored.');
  }

  const messages = bot.deleted.filter(m => m.author.id === user.id);
  if (!messages || messages.length < 1) {
    return msg.reply('No deleted messages were found for that user.');
  }

  const content = messages.map((m) => {
    bot.deleted.delete(m.id);
    return `• ${m.content}\n`;
  }).join('');
  await msg.channel.createMessage({ content });
};

exports.info = {
  name: 'restore',
  usage: 'restore <@user>',
  description: 'Restore deleted messages from a user',
  level: ['Admin', 'Staff'],
};
