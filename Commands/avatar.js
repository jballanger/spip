exports.run = async (bot, msg) => {
	const user = msg.mentions[0];
	if (!user) {
		throw 'Please mention the user who you want the avatar from.';
	}

	if (!user.avatarURL) {
		throw 'That user does not exist or does not have an avatar';
	}

	(await msg.channel.createMessage({
		embed: bot.utils.embed(
				`${user.username}'s avatar`,
				`[Download](${user.avatarURL})`,
				[],
				{
					image: {
						url: `${user.avatarURL}`,
						height: 120,
						width: 120
					}
				}
			)
	}));
};

exports.info = {
	name: 'avatar',
	usage: 'avatar <@user>',
	description: 'Display the avatar of a user',
	level: []
};