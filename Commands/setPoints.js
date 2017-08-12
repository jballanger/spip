exports.run = (bot, msg, args) => {
	const user = msg.mentions[0];
	const points = parseInt(args[1], 10);
	if (!points) throw 'Invalid number of points';
	bot.database.models.User.model.update({points: points}, {where: {uid: user.id, gid: msg.channel.guild.id}}).then((row) => {
		if (row[0] < 1) throw `${row[0]} rows were affected`;
	});
}

exports.info = {
	name: 'setpoints',
	description: 'Change the number of points a user have',
	usage: 'setpoints <@user> <points>',
	level: ['Admin']
}