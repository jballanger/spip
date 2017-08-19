exports.run = async (bot, msg) => {
	const user = msg.mentions.users.first();
	if (!user) throw 'Please mention the user who you want the avatar from.';
	if (!user.avatarURL) throw 'That user does not exist or does not have an avatar';

	let embed = new bot.discord.RichEmbed()
		.setTitle(`${user.username}'s avatar`)
		.setDescription(`[Download](${user.avatarURL})`)
		.setImage(user.avatarURL);
	await msg.channel.send({embed: embed});
};

exports.info = {
	name: 'avatar',
	usage: 'avatar <@user>',
	description: 'Display the avatar of a user',
	level: []
};