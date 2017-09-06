exports.run = async (bot, msg, args) => {
	if (msg.mentions.users.size < 1) throw 'No user given.';
	const user = msg.mentions.users.first();
	const points = parseInt(args[1], 10);
    if (!points) throw 'Invalid number of points';
    let newPoints = points;
    await bot.database.getUser(user, msg.channel.guild.id).then((u) => {newPoints += u.points;});
	bot.database.models.User.model.update({points: newPoints}, {where: {uid: user.id, gid: msg.channel.guild.id}}).then((row) => {
        if (row[0] < 1) throw `${row[0]} rows were affected`;
        else msg.reply(`<@${user.id}> got ${points} points.`);
	});
};

exports.info = {
    name: 'addpoints',
    description: 'Add points to a user',
    usage: 'addpoints <@user> <points>',
    level: ['Admin', 'Staff']
};