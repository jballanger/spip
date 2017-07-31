const chalk = require('chalk');
const popura = require('popura');

exports.run = async (bot, msg, args) => {
	const mal = popura(
				bot.utils.decrypt(_config.myanimelist.username),
				bot.utils.decrypt(_config.myanimelist.password)
			);
	var search = args.join('');
	await mal.searchMangas(search).then((res) => {
		console.log(res);
	}).catch((err) => {
		console.error(chalk.red('Error while searching mangas with "', chalk.underline(search), `".\n${err}`));
	});
}

exports.info = {
	name: 'manga',
	usage: 'manga <search>',
	description: 'Get details of a manga from MyAnimeList',
	level: []
}