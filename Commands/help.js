exports.run = async (bot, msg, args) => {
	let command = bot.commands.get(args[0]);
	if (!command)
		throw 'Command not found.';
	let embed = new bot.discord.RichEmbed()
				.setTitle(`Help for ${command.info['name']}`)
				.addField('Usage', `${_config.discord.prefix}${command.info['usage']}`)
				.addField('Description', command.info['description'])
				.addField('Role required', command.info['level'].length > 0 ? `One of ${command.info['level'].map(a => '**'+a+'**').join(', ')}` : 'None');
	await msg.channel.send({embed: embed});
		
		/*embed: bot.utils.embed(
				`Help for ${command.info['name']}`,
				'',
				[{
					name: 'Usage',
					value: `${_config.discord.prefix}${command.info['usage']}`
				},
				{
					name: 'Description',
					value: `${command.info['description']}`
				},
				{
					name: 'Role required',
					value: command.info['level'].length > 0
							? `One of ${command.info['level'].map(a => '**'+a+'**').join(', ')}`
							: 'None'
				}],
				{}
			)*/
};

exports.info = {
	name: 'help',
	usage: 'help <command>',
	description: 'Display the help of a command',
	level: []
};