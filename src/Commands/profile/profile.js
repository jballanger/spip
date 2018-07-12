const path = require('path');
const { registerFont, createCanvas } = require('canvas');

registerFont(path.resolve(__dirname, '../../Misc/OpenSans-Regular.ttf'), { family: 'Open Sans' });

exports.run = async (bot, msg) => {
  const user = msg.mentions.users.size > 0 ? msg.mentions.users.first() : msg.author;
  const userData = await user.data.get();
  const userLevel = bot.stats.getLevel(userData.exp);
  const userPercent = bot.stats.getPercent(userLevel, userData.exp);
  const userRank = bot.stats.getRank(msg.guild.id, user.id);
  const [background, badge, avatar] = await Promise.all([
    bot.utils.loadImage(`src/Misc/profile/background${bot.utils.randomNumber(1, 5)}.png`),
    bot.utils.loadImage(`src/Misc/profile/badge${bot.utils.randomNumber(1, 8)}.png`),
    bot.utils.loadImageUrl(user.avatarURL || user.defaultAvatarURL),
  ]);
  const profile = createCanvas(360, 120);
  const ctx = profile.getContext('2d');
  ctx.drawImage(background, 0, 0, 360, 120);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#E2E3E5';
  ctx.fillRect(54, 9, 286, 102);
  ctx.globalAlpha = 0.8;
  ctx.fillRect(20, 26, 68, 68);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'grey';
  ctx.fillRect(99, 39, 208, 12);
  ctx.fillStyle = 'white';
  ctx.fillRect(100, 40, 206, 10);
  ctx.fillStyle = 'grey';
  ctx.fillRect(102, 42, (userPercent / 100) * 202, 6);
  ctx.beginPath();
  ctx.moveTo(160, 55);
  ctx.lineTo(160, 105);
  ctx.stroke();
  ctx.fillStyle = '#6c6c6c';
  ctx.font = '20px "Open Sans"';
  ctx.fillText(user.username, 100, 30);
  ctx.font = '20px "Open Sans"';
  ctx.fillText('LEVEL', 100, 70);
  ctx.font = '30px "Open Sans"';
  ctx.fillText(userLevel, (130 - (userLevel.toString().length * 10)), 100);
  ctx.font = '15px "Open Sans"';
  ctx.fillText('Server Rank', 170, 75);
  ctx.fillText('Points', 170, 95);
  ctx.fillText(`#${userRank}`, 270, 75);
  ctx.fillText(userData.points, 270, 95);
  ctx.font = '10px "Open Sans"';
  ctx.fillText(`${userPercent}%`, 310, 48);
  ctx.globalAlpha = 1;
  ctx.drawImage(badge, 310, 10, 24, 24);
  ctx.drawImage(avatar, 22, 28, 64, 64);
  const result = await profile.toBuffer();
  return msg.channel.send({
    file: {
      attachment: result,
      name: `${user.username}.png`,
    },
  });
};

exports.info = {
  name: 'profile',
  usage: 'profile <@user>',
  description: 'Shows a user profile',
  level: [],
};
