exports.run = (bot, msg, args) => {
	let url = args[0];
	if (!url) ||  throw 'Invalid url.';
	url = args.join(' ');
	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel || voiceChannel.type !== 'voice') throw 'You are not in a voice channel.';
	const permissions = voiceChannel.permissionsFor(bot.user);
	if (!permissions.hasPermission('CONNECT')) throw 'I don\'t have permissions to join your voice channel.';
	if (!permissions.hasPermission('SPEAK')) throw 'I don\'t have permissions to speak in your voice channel.';
	let data = {
		url: url,
		guildId: msg.channel.guild.id,
		textChannel: msg.channel,
		connection:
	}
}

exports.info = {
	name: 'play',
	description: 'Add a music to the queue and start playing',
	usage: 'play <youtube link | search>',
	level: []
}