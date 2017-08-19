const chalk = require('chalk');
const htmlToText = require('html-to-text');

exports.run = async (bot, msg, args) => {
	var search = args.join(' ');
	await bot.chinmei.searchSingleAnime(search).then(async (anime) => {
		var malUrl = 'https://myanimelist.net/anime/';
		if (!anime) {
			throw  [42, 'That anime could not be found.'];
		}

		let synopsis = htmlToText.fromString(anime.synopsis, {ignoreHref: true}).replace(/\[(.+?)\]/g, '').replace(/\n/g, ' ');
		let embed = new bot.discord.RichEmbed()
			.setTitle(anime.title)
			.setDescription(anime.english.length > 0 ? `(${anime.english})` : '')
			.setURL(`${malUrl}${anime.id}/`)
			.setThumbnail(anime.image)
			.setFooter('MyAnimeList', 'https://myanimelist.cdn-dena.com/images/faviconv5.ico')
			.addField('Episodes', anime.episodes === 0 ? 'Unknow' : String(anime.episodes), true)
			.addField('Type', anime.type, true)
			.addField('Status', anime.status, true)
			.addField('Score', anime.score, true)
			.addField('Start date', anime.start_date, true)
			.addField('End date', anime.end_date === '0000-00-00' ? 'Unknow' : anime.end_date, true)
			.addField('Synopsis', `${synopsis.substr(0, 500)}${synopsis.length > 500 ? '[...]' : ''}`);
		await msg.channel.send({embed: embed});
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