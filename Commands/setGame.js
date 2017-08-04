const fs = require('fs');
const chalk = require('chalk');
var config = require('../config.json');

exports.run = async (bot, msg, args) => {
	bot.utils.parser(args).then(async (parser) => {
		let game = parser.args.join(' ');
		bot.editStatus('online', bot.utils.game(game));
		if (parser.options.indexOf('--save') !== -1 || parser.options.indexOf('-s') !== -1) {
			config.discord.game = game;
			fs.writeFile('config.json', JSON.stringify(config, null, 4), (err) => {
				if (err) {
					console.error(chalk.red(`Error while saving config.json !\n${err}`));
					throw 'Couldn\'t save config.json';
				}
			});
		}
	});
}

exports.info = {
	name: 'setgame',
	description: 'Change spip\'s game',
	usage: 'setGame [--save] <game>',
	level: ['Admin', 'Staff']
}