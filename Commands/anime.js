const chalk = require('chalk');
const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
	var search = args.join(' ');
	await bot.chinmei.searchAnime(search).then((res) => {
		var malUrl = 'https://myanimelist.net/anime/';
		let anime = res;
		if (!anime) {
			throw  [42, 'That anime could not be found.'];
		}

		let synopsis = htmlToText.fromString(anime.synopsis, {ignoreHref: true}).replace(/\[(.+?)\]/g, '').replace(/\n/g, ' ');
		msg.channel.createMessage({
			embed: bot.utils.embed(
				anime.title,
				anime.english.length > 0 ? `(${anime.english})` : '',
				[{
					name: 'Episodes',
					value: anime.episodes === 0 ? 'Unknow' : String(anime.episodes),
					inline: true					
				},
				{
					name: 'Type',
					value: String(anime.type),
					inline: true
				},
				{
					name: 'Status',
					value: String(anime.status),
					inline: true
				},
				{
					name: 'Score',
					value: String(anime.score),
					inline: true
				},
				{
					name: 'Start date',
					value: String(anime.start_date),
					inline: true
				},
				{
					name: 'End date',
					value: anime.end_date === '0000-00-00' ? 'Unknow' : String(anime.end_date),
					inline: true
				},
				{
					name: 'Synopsis',
					value: `${synopsis.substr(0, 500)}${synopsis.length > 500 ? '[...]' : ''}`
				}],
				{
					url: `${malUrl}${anime.id}/`,
					footer: {
						text: 'MyAnimeList',
						icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
					},
					thumbnail: {
						url: anime.image
					}
				}
			)
		});
	}).catch((err) => {
		if (err[0] && err[0] === 42) {
			throw err[1];
		} else {
			console.error(chalk.red(`Error while searching anime "${chalk.underline(search)}".\n${err}`));
			throw 'Something wrong happened, please contact an Admin.';
		}
	});
}

exports.info = {
	name: 'anime',
	usage: 'anime <search>',
	description: 'Get details of an anime from MyAnimeList',
	level: []
}