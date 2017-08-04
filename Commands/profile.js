const Canvas = require('canvas');
Canvas.registerFont('Misc/OpenSans-Regular.ttf', {family: 'Open Sans'});

exports.run = async (bot, msg) => {
	let url = 'http://68.media.tumblr.com/bfb0f81e675d54b4a11fa1e1e6d4c131/tumblr_nvsghaVXCl1sb4zfeo1_1280.png';
	bot.utils.loadImageUrl(url, msg.author.avatarURL).then(async (images) => {
		let profile = new Canvas(360, 120);
		let ctx = profile.getContext('2d');
		ctx.drawImage(images[1], 0, 0, 360, 120);
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = '#E2E3E5';
		//ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(54, 9, 286, 102);
		ctx.globalAlpha = 0.8;
		ctx.fillRect(20, 26, 68, 68);
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.moveTo(200, 55);
		ctx.lineTo(200, 105);
		ctx.stroke();
		ctx.fillStyle = "#6c6c6c";
		ctx.font = '20px "Open Sans"';
		ctx.fillText(msg.author.username, 100, 30);
		ctx.font = '20px "Open Sans"';
		ctx.fillText('LEVEL', 100, 70);
		ctx.font = '30px "Open Sans"';
		ctx.fillText('21', 110, 100);
		ctx.globalAlpha = 1;
		ctx.drawImage(images[0], 22, 28, 64, 64);
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