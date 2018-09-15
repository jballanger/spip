exports.run = async (bot, msg) => {
  const { features } = bot;
  let message = '';
  features.forEach((feature) => {
    message += `\n**${feature}:**`;
    const featureSettings = bot[feature].settings;
    Object.keys(featureSettings).forEach((setting) => {
      const featureSetting = featureSettings[setting];
      const keys = featureSetting.key.map(k => `-${k}`).join('; ');
      message += ` ${keys} <${featureSetting.class || featureSetting.type}>`;
    });
  });
  return msg.reply(message);
};

exports.info = {
  name: 'features',
  description: 'List the available features',
  usage: 'features',
  level: ['Admin'],
};
