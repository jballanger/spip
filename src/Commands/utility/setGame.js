const fs = require('fs');
const chalk = require('chalk');

const config = _config;

exports.run = async (bot, msg, args) => {
  bot.utils.parser(args).then(async (parser) => {
    const game = parser.args.join(' ');
    bot.user.setGame(game);
    if (parser.options.indexOf('--save') !== -1 || parser.options.indexOf('-s') !== -1) {
      config.discord.game = game;
      fs.writeFile('config.json', JSON.stringify(config, null, 4), (err) => {
        if (err) throw new Error('Couldn\'t save config.json');
      });
    }
  });
};

exports.info = {
  name: 'setgame',
  description: 'Change spip\'s game',
  usage: 'setGame [--save] <game>',
  level: ['Admin', 'Staff'],
};
