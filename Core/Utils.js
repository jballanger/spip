const crypto = require('crypto');
const leven = require('leven');
const request = require('request');
const requestImage = require('request').defaults({encoding: null});
const Canvas = require('canvas');
const Image = Canvas.Image;

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

exports.findOne = (arr1, collection) => {
	arr1.forEach((elem, i) => {
		if (collection.has('name', elem))
			return 1;
		else if (i == arr1.length)
			return 0;
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

exports.loadImageUrl = (...urls) => {
	return new Promise((resolve, reject) => {
		var images = [];
		var completed = 0;
		for (var i = 0; i < urls.length; i++) {
			let img = new Image;
			images.push(img);
			requestImage.get(urls[i], (err, res, data) => {
				if (err) reject(err);
				let curr = i;
				img.onload = () => {
						completed++;
						if (completed == urls.length)
							resolve(images);
				};
				img.src = new Buffer(data, 'base64');
			});
		}
	});
}

exports.parser = (args) => {
	return new Promise(async (resolve, reject) => {
		let options = [];
		while (args[0].startsWith('-')) {
			options.push(args[0]);
			args = args.slice(1);
			if (!args[0].startsWith('-'))
				resolve({options: options, args: args});
		}
		if (!args[0].startsWith('-'))
			resolve({options: options, args: args});
	});
}