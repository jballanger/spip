const chalk = require('chalk');
const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
	var search = args.join(' ');
	await bot.popura.searchMangas(search).then((res) => {
		var malUrl = 'https://myanimelist.net/manga/';
		let manga = bot.utils.levenSort(res, search, 'title')[0];
		if (!manga) {
			throw  [42, 'That manga could not be found.'];
		}

		let synopsis = htmlToText.fromString(manga.synopsis, {ignoreHref: true}).replace(/\[(.+?)\]/g, '').replace(/\n/g, ' ');
		msg.channel.createMessage({
			embed: bot.utils.embed(
				manga.title,
				manga.english.length > 0 ? `(${manga.english})` : '',
				[{
					name: 'Chapters',
					value: manga.chapters === 0 ? 'Unknow' : String(manga.chapters),
					inline: true
				},
				{
					name: 'Volumes',
					value: manga.volumes === 0 ? 'Unknow' : String(manga.volumes),
					inline: true					
				},
				{
					name: 'Status',
					value: String(manga.status),
					inline: true
				},
				{
					name: 'Score',
					value: String(manga.score),
					inline: true
				},
				{
					name: 'Start date',
					value: String(manga.start_date),
					inline: true
				},
				{
					name: 'End date',
					value: manga.end_date === '0000-00-00' ? 'Unknow' : String(manga.end_date),
					inline: true
				},
				{
					name: 'Synopsis',
					value: `${synopsis.substr(0, 500)}${synopsis.length > 500 ? '[...]' : ''}`
				}],
				{
					url: `${malUrl}${manga.id}/`,
					footer: {
						text: 'MyAnimeList',
						icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
					},
					thumbnail: {
						url: manga.image
					}
				}
			)
		});
	}).catch((err) => {
		if (err[0] && err[0] === 42) {
			throw err[1];
		} else {
			console.error(chalk.red(`Error while searching manga "${chalk.underline(search)}".\n${err}`));
			throw 'Something wrong happened, please contact an Admin.';
		}
	});
}

exports.info = {
	name: 'manga',
	usage: 'manga <search>',
	description: 'Get details of a manga from MyAnimeList',
	level: []
}