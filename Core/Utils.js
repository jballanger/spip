const crypto = require('crypto');
const leven = require('leven');

exports.randomColor = () => {
    return Math.floor(Math.random() * (0xFFFFFF + 1));
}

exports.randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
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

exports.encrypt = (text) => {
	var cipher = crypto.createCipher(_config.crypto.a, _config.crypto.p);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

exports.decrypt = (text) => {
	var decipher = crypto.createDecipher(_config.crypto.a, _config.crypto.p);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

exports.levenSort = (arr, src, key = null) => {
	return arr.sort(function(a, b) {
		let aKey = key ? a[key] : a;
		let bKey = key ? b[key] : b;
		return leven(src, aKey) < leven(src, bKey) ? -1 : 1;
	});
}