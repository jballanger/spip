const dateFormat = require('dateformat');

dateFormat('dddd, mmmm dS, yyyy, HH:MM:ss');

exports.run = async (bot, msg, args) => {
	let id = msg.mentions.users.size > 0 ? msg.mentions.users.firstKey() : args[0];
	let member = id ? msg.channel.guild.members.find('id', id) : null;
	if (!member) throw 'That user could not be found.';

	let userStats = null;
	await bot.database.getUser(member.user, msg.channel.guild.id).then((u) => {userStats = u});
	let embed = new bot.discord.RichEmbed()
		.setTitle(member.user.tag)
		.setDescription(member.user.avatarURL ? `[Download avatar](${member.user.avatarURL})` : '')
		.setFooter(member.id)
		.setThumbnail(member.user.avatarURL)
		.addField('Status', member.presence.status, true)
		.addField('Game', member.presence.status.game ? member.presence.status.game.name : 'Not playing', true)
		.addField('Level', userStats.level, true)
		.addField('Exp', `${userStats.exp}/${bot.Stats.formula(userStats.level + 1)}`, true)
		.addField('Points', userStats.points, true)
		.addField('Rank', userStats.rank, true)
		.addField('Created at', dateFormat(member.user.createdAt), true)
		.addField('Joined at', dateFormat(member.joinedAt), true)
		.addField('Roles', member.roles.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'None');
	await msg.channel.send({embed: embed});
}

exports.info = {
	name: 'fetch',
	description: 'Shows info about a user',
	usage: 'fetch <uid|@user>',
	level: ['Admin', 'Staff']
}