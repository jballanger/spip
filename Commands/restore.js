exports.run = async (bot, msg) => {
	let user = msg.mentions[0];
	if (!user) {
		throw 'Please mention the user you want the messages restored.';
	}

	let messages = bot.deleted.filter(m => m.author.id === user.id);
	if (!messages || messages.length < 1) {
		throw 'No deleted messages were found for that user.';
	}

	let content = messages.map(function(m) {
		bot.deleted.delete(m.id);
		return `• ${m.content}\n`;
	}).join('');
	(await msg.channel.createMessage({
		content: content
	}));
};

exports.info = {
	name: 'restore',
	usage: 'restore <@user>',
	description: 'Restore deleted messages from a user',
	level: ['Admin', 'Staff']
};