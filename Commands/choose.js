exports.run = async (bot, msg, args) => {
	var choices = args.join('').split('|');
	let n = bot.utils.randomNumber(0, choices.length);
	(await msg.channel.createMessage({
		content: choices[n].trim()
	}));
}

exports.info = {
	name: 'choose',
	usage: 'choose <foo|bar|...>',
	description: 'Makes a choice for you',
	level: []
}