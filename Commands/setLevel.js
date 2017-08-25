exports.run = (bot, msg, args) => {
	if (msg.mentions.users.size < 1) throw 'No user given.';
	const user = msg.mentions.users.first();
	const level = parseInt(args[1], 10);
	if (!level) throw 'Invalid level';
	bot.database.models.User.model.update({level: level}, {where: {uid: user.id, gid: msg.channel.guild.id}}).then((row) => {
		if (row[0] < 1) throw `${row[0]} rows were affected`;
	});
};

exports.info = {
	name: 'setlevel',
	description: 'Change the level of a user',
	usage: 'setlevel <@user> <level>',
	level: ['Admin']
};