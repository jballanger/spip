const dateFormat = require('dateformat');

dateFormat('dddd, mmmm dS, yyyy, HH:MM:ss');

exports.run = async (bot, msg, args) => {
	let guild = msg.channel.guild;
	let member = guild.members.get(args[0]) || guild.members.get(msg.mentions[0].id);
	if (!member) {
		throw 'That user could not be found.';
	}

	let game = (member && member.game) ? member.game.name : 'Not playing';
	let roles = member.roles.map(function(role) {
		let r = guild.roles.find(r => r.id === role);
		return r.name;
	});
	roles.length > 0
	? roles = roles.join(', ')
	: roles = 'None';

	let user = null;
	await bot.database.getUser(member).then((u) => {user = u});
	(await msg.channel.createMessage({
		embed: bot.utils.embed(
				`${member.username}#${member.discriminator}`,
				`[Download avatar](${member.avatarURL})`,
				[{
					name: 'Status',
					value: `${member.status}`,
					inline: true
				},
				{
					name: 'Game',
					value: game,
					inline: true
				},
				{
					name: 'Level',
					value: user.level,
					inline: true
				},
				{
					name: 'Exp',
					value: `${user.exp}/${bot.Stats.formula(user.level + 1)}`,
					inline: true
				},
				{
					name: 'Points',
					value: user.points,
					inline: true
				},
				{
					name: 'Rank',
					value: user.rank,
					inline: true
				},
				{
					name: 'Created On',
					value: `${dateFormat(member.createdAt)}`,
					inline: true
				},
				{
					name: 'Joined On',
					value: `${dateFormat(member.joinedAt)}`,
					inline: true
				},
				{
					name: 'Roles',
					value: roles
				}],
				{
					footer: {
						'text': `UserID ${member.id}`
					},
					thumbnail: {
						url: member.avatarURL
					}
				}
			)
	}));
}

exports.info = {
	name: 'fetch',
	usage: 'fetch <uid|@user>',
	description: 'Shows info about a user',
	level: ['Admin', 'Staff']
}