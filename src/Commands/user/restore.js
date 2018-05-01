exports.run = async (bot, msg) => {
  const user = msg.mentions.users.first();
  if (!user) {
    return msg.reply('Please mention the user you want the messages restored.');
  }
  const messages = bot.deleted.filter(m => m.author.id === user.id);
  if (!messages || messages.size < 1) {
    return msg.reply('No deleted messages were found for that user.');
  }
  let deletedMessages = `Deleted messages from <@${user.id}>:\n`;
  messages.forEach((m) => {
    bot.deleted.delete(m.id);
    deletedMessages += `**•** __*[${m.createdAt}]*__ ${m.content}\n`;
  });
  return msg.channel.send(deletedMessages);
};

exports.info = {
  name: 'restore',
  usage: 'restore <@user>',
  description: 'Restore deleted messages from a user',
  level: ['Admin', 'Staff'],
};
