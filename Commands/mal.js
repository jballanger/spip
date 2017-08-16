exports.run = (bot, msg, args) => {
	if (!args || !args[0]) throw 'No user given.';
	let user = args[0];
	let p1 = bot.chinmei.getMalUser(user, 1);
	let p2 = bot.chinmei.getMalUser(user, 2);
	return Promise.all([p1, p2]).then(async (malUser) => {
		let u1 = malUser[0].myinfo;
		let u2 = malUser[1].myinfo;
		(await msg.channel.createMessage({
			embed: bot.utils.embed(
				u1.user_name,
				'MyAnimeList Infos',
				[{
					name: 'Watching',
					value: u1.user_watching,
					inline: true
				},
				{
					name: 'Reading',
					value: u2.user_reading,
					inline: true
				},
				{
					name: 'Anime Completed',
					value: u1.user_completed,
					inline: true
				},
				{
					name: 'Manga Completed',
					value: u2.user_completed,
					inline: true
				},
				{
					name: 'Anime On hold',
					value: u1.user_onhold,
					inline: true
				},
				{
					name: 'Manga On hold',
					value: u2.user_onhold,
					inline: true
				},
				{
					name: 'Anime Dropped',
					value: u1.user_dropped,
					inline: true
				},
				{
					name: 'Manga Dropped',
					value: u2.user_dropped,
					inline: true
				},
				{
					name: 'Plan to watch',
					value: u1.user_plantowatch,
					inline: true
				},
				{
					name: 'Plan to read',
					value: u2.user_plantoread,
					inline: true
				}],
				{
					url: `https://myanimelist.net/profile/${u1.user_name}`,
					footer: {
						text: u1.user_id,
						icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
					}
				}
			)
		}));
	}).catch((e) => {
		throw 'User not found.';
	});
	throw 'test';
}

exports.info = {
	name: 'mal',
	description: 'Get informations about a MyAnimeList user',
	usage: 'mal <user>',
	level: []
}