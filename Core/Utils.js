exports.randomColor = () => {
    return Math.floor(Math.random() * (0xFFFFFF + 1));
}

exports.embed = (title, description = '', fields = [], options = {}) => {
	return {
			title: title,
			type: 'rich',
			description: description,
			url: options.url || '',
			timestamp: options.timestamp,
			color: options.color || this.randomColor(),
			footer: options.footer,
			image: options.image,
			thumbnail: options.thumbnail,
			video: options.video,
			provider: options.provider,
			author: options.author,
			fields: fields
		}
}

exports.findOne = (haystack, arr) => {
	return arr.some(function(v) {
		return haystack.indexOf(v) >= 0;
	});
}

exports.getRoles = (msg) => {
	let roles = msg.channel.guild.roles;
	let userRoles = msg.member.roles;

	return userRoles.map(function(userRole) {
		let role = roles.find(role => role.id === userRole);
		return role.name;
	});
}

exports.game = (name, type = 0, url = '') => {
	return {
		name: name,
		type: type,
		url: url
	}
}