const Canvas = require('canvas');
Canvas.registerFont('Misc/OpenSans-Regular.ttf', {family: 'Open Sans'});

exports.run = async (bot, msg) => {
	if (!bot.database.use) throw 'This command is actually unavailable';
	let profileUser = msg.mentions.length > 0 ? msg.mentions[0] : msg.author;
	await bot.database.getUser(profileUser, msg.channel.guild.id).then((u) => {user = u});
	user.exp =  bot.Stats.getExpPercent(user.level, user.exp);
	let backgrounds = [
		'http://img04.deviantart.net/793d/i/2016/009/e/1/background_anime_1_by_al00ndr44-d9nd73s.png',
		'http://img12.deviantart.net/75f8/i/2016/234/9/0/anime_background_by_nieris-daeuy2n.png',
		'https://s-media-cache-ak0.pinimg.com/originals/6c/d3/ca/6cd3cab620096278d6c7495910661a5c.png',
		'https://s-media-cache-ak0.pinimg.com/originals/78/b5/e0/78b5e0b8f48fd04d6e271568e8399b4d.png',
		'http://orig08.deviantart.net/fe76/f/2015/131/2/c/anime_school__6_by_shamelessbeauty3-d8szdgt.png',

	];
	let url = user.background || backgrounds[bot.utils.randomNumber(0, backgrounds.length)];
	let badges = [
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17564_18_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17552_6_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17556_10_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17560_14_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17568_22_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17571_25_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17574_28_.png',
		'http://www.p-pokemon.com/images-pokemon-actualite/pict_champions-arene-pokemon-rubis-omega-saphir-alpha_17583_37_.png'
	];
	let url2 = badges[bot.utils.randomNumber(0, badges.length)];
	bot.utils.loadImageUrl(url, profileUser.avatarURL, url2).then(async (images) => {
		let profile = new Canvas(360, 120);
		let ctx = profile.getContext('2d');
		ctx.drawImage(images[0], 0, 0, 360, 120);
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
		ctx.fillRect(102, 42, (parseInt(user.exp, 10) / 100) * 202, 6);
		ctx.beginPath();
		ctx.moveTo(160, 55);
		ctx.lineTo(160, 105);
		ctx.stroke();
		ctx.fillStyle = "#6c6c6c";
		ctx.font = '20px "Open Sans"';
		ctx.fillText(user.username, 100, 30);
		ctx.font = '20px "Open Sans"';
		ctx.fillText('LEVEL', 100, 70);
		ctx.font = '30px "Open Sans"';
		ctx.fillText(user.level, (130 - (user.level.toString().length) * 10), 100);
		ctx.font = '15px "Open Sans"';
		ctx.fillText('Server Rank', 170, 75);
		ctx.fillText('Points', 170, 95);
		ctx.fillText('#'+user.rank, 270, 75);
		ctx.fillText(user.points, 270, 95);
		ctx.font = '10px "Open Sans"';
		ctx.fillText(user.exp+'%', 310, 48);
		ctx.globalAlpha = 1;
		ctx.drawImage(images[1], 22, 28, 64, 64);
		ctx.drawImage(images[2], 310, 10, 24, 24)
		let result = await profile.toBuffer();
		(await msg.channel.createMessage({}, {
			file: result,
			name: 'ptest.png'
		}));
	}).catch((e) => {
		throw e;
	});
}

exports.info = {
	name: 'profile',
	usage: 'profile <@user>',
	description: 'Shows a user profile',
	level: []
}