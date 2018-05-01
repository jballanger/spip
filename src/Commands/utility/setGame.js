const fs = require('fs');

const config = _config;

exports.run = async (bot, msg, args) => {
  const parsed = await bot.utils.parser(args);
  const game = parsed.args.join(' ');
  bot.user.setPresence({ game: { name: game } });
  if (parsed.options.includes('--save') || parsed.options.includes('-s')) {
    config.discord.game = game;
    fs.writeFile('config.json', JSON.stringify(config, null, 4), (err) => {
      if (err) throw new Error(`Couldn't save config.json ${err}`);
    });
  }
};

exports.info = {
  name: 'setgame',
  description: 'Change spip\'s game',
  usage: 'setGame [--save] <game>',
  level: ['Admin', 'Staff'],
};
