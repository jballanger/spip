exports.run = async (bot, msg, args) => {
	let throwToUser = (msg) => {
		throw msg;
	}
	let price = _config.discord.shop.background;
	let user = null;
	await bot.database.getUser(msg.author, msg.channel.guild.id).then((u) => {user = u});
	if (user.points < price) throwToUser(`${price} points are needed to change profile background.`);
	let url = args[0];
	console.log(url.endsWith('.png'));
	console.log(url.endsWith('.jpg'));
	if (!url.endsWith('.png') && !url.endsWith('.jpg')) throwToUser('Please provide a png or jpg image');
	bot.database.models.User.model.update({points: (user.points - price), background: url}, {where: {uid: user.uid, gid: msg.channel.guild.id}}).then((row) => {
		if (row[0] < 1) throw `${row[0]} rows were affected on ${user.uid}\'s background update.`;
	});
}

exports.info = {
	name: 'setbackground',
	description: `Changes your profile background for ${_config.discord.shop.background} points`,
	usage: 'setbackground <imageURL>',
	level: []
}