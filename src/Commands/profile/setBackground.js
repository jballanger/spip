exports.run = async (bot, msg, args) => {
  const throwToUser = (message) => {
    throw new Error(message);
  };
  const price = _config.discord.shop.background;
  let user = null;
  await bot.database.getUser(msg.author, msg.channel.guild.id).then((u) => { user = u; });
  if (user.points < price) throwToUser(`${price} points are needed to change profile background.`);
  const url = args[0];
  if (!url.endsWith('.png') && !url.endsWith('.jpg')) throwToUser('Please provide a png or jpg image');
  let hostedUrl;
  await bot.utils.uploadImage(url, msg.author.id).then((res) => { hostedUrl = res; });
  if (!hostedUrl.startsWith('http://')) throw new Error(hostedUrl);
  bot.database.models.User.model.update({
    points: (user.points - price),
    background: hostedUrl,
  }, {
    where: {
      uid: user.uid,
      gid: msg.channel.guild.id,
    },
  }).then((row) => {
    if (row[0] < 1) throw new Error(`${row[0]} rows were affected on ${user.uid}'s background update.`);
    else msg.reply('Background successfully set !');
  });
};

exports.info = {
  name: 'setbackground',
  description: `Changes your profile background for ${_config.discord.shop.background} points`,
  usage: 'setbackground <imageURL>',
  level: [],
};
