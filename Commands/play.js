exports.run = (bot, msg, args) => {
	let url = args[0];
	if (!url) throw 'Invalid url.';
	url = args.join(' ').replace('<', ''). replace('>', '');
	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel || voiceChannel.type !== 'voice') throw 'You are not in a voice channel.';
	const permissions = voiceChannel.permissionsFor(bot.user);
	if (!permissions.has('CONNECT')) throw 'I don\'t have permissions to join your voice channel.';
	if (!permissions.has('SPEAK')) throw 'I don\'t have permissions to speak in your voice channel.';
	voiceChannel.join().then(connection => {
		let data = {
			url: url,
			msg: msg,
			guildId: msg.channel.guild.id,
			textChannel: msg.channel,
			connection: connection
		};
		bot.musicManager.addSong(data);
	});
}

exports.info = {
	name: 'play',
	description: 'Add a music to the queue and start playing',
	usage: 'play <youtube link | search>',
	level: []
}