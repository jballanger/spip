exports.run = async (bot, msg) => {
  const user = msg.mentions.users.first();
  if (!user) return msg.reply('Please mention the user who you want the avatar from.');
  if (!user.avatarURL) return msg.reply('That user does not exist or does not have an avatar');

  const embed = new bot.discord.RichEmbed()
    .setTitle(`${user.username}'s avatar`)
    .setDescription(`[Download](${user.avatarURL})`)
    .setImage(user.avatarURL);
  await msg.channel.send({ embed });
};

exports.info = {
  name: 'avatar',
  description: 'Display the avatar of a user',
  usage: 'avatar <@user>',
  level: [],
};
