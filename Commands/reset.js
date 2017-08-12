exports.run = (bot, msg) => {
	if (!msg.mentions[0]) throw 'Invalid user';
	const user = msg.mentions[0];
	bot.database.models.User.model.destroy({where: {uid: user.id, gid: msg.channel.guild.id}}).then((row) => {
		if (row[0] < 1) throw `${row[0]} rows were affected`;
	});
}

exports.info = {
	name: 'reset',
	description: 'Reset user\'s stats',
	usage: 'reset <@user>',
	level: ['Admin', 'Staff']
}