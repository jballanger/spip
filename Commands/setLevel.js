exports.run = (bot, msg, args) => {
	const user = msg.mentions[0];
	const level = parseInt(args[1], 10);
	if (!level) throw 'Invalid level';
	bot.database.models.User.model.update({level: level}, {where: {uid: user.id}}).then((row) => {
		if (row[0] < 1) throw `${row[0]} rows were affected`;
	});
}

exports.info = {
	name: 'setlevel',
	description: 'Change the level of a user',
	usage: 'setlevel <@user> <level>',
	level: ['Admin']
}