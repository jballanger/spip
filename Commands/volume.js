exports.run = (bot, msg, args) => {
	let dispatcher = bot.musicManager.dispatcher.get(msg.channel.guild.id);
	let volume = bot.musicManager.volume;
	let currentVolume = volume.get(msg.channel.guild.id);
	let newVolume = parseInt(args[0], 10);
	if (!args[0]) return (msg.channel.send(`The current volume is **${currentVolume}**`));
	if (isNaN(newVolume)) {
		newVolume = args[0].toLowerCase();
		if (newVolume === 'up' || newVolume === '+') newVolume = currentVolume + 2;
		else if (newVolume === 'down' || newVolume === '-') newVolume = currentVolume - 2;
		else return (msg.reply(`Invalid volume.`));
	}
	if (newVolume > 10) newVolume = 10;
	if (newVolume < 1) newVolume = 1;
	dispatcher.setVolumeLogarithmic(newVolume / 5);
	volume.set(msg.channel.guild.id, newVolume);
	msg.channel.send(`The volume is now **${newVolume}**`);
};

exports.info = {
	name: 'volume',
	description: 'Display or set the current music volume',
	usage: 'volume [{1..10} | up / down | + / -]',
	level: []
};