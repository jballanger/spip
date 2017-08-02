const Canvas = require('canvas');

exports.run = async (bot, msg) => {
	let url = 'http://68.media.tumblr.com/bfb0f81e675d54b4a11fa1e1e6d4c131/tumblr_nvsghaVXCl1sb4zfeo1_1280.png';
	bot.utils.loadImageUrl(url).then(async (img) => {
		let avatar = new Canvas.Image;
		let profile = new Canvas(360, 100);
		let ctx = profile.getContext('2d');
		ctx.drawImage(img, 0, 0, 360, 100);
		ctx.globalAlpha = 0.6;
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(103, 4, 254, 92);
		ctx.globalAlpha = 0.6;
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(4, 4, 92, 92);
		ctx.font = "30px Calibri";
		ctx.fillText("WeebZ King", 5, 30);
		ctx.font = "20px Calibri";
		ctx.fillText(msg.author.username, 5, 55);
		let result = await profile.toBuffer();
		//ctx.drawImage(avatar, 10, 10, 76, 76);
		(await msg.channel.createMessage({}, {
				file: result,
				name: 'ptest.png'
		}));
		//avatar.src = new Buffer(msg.author.avatar, 'base64');
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