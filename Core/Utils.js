const request = require('request');
const requestImage = require('request').defaults({encoding: null});
const Canvas = require('canvas');
const Image = Canvas.Image;

exports.randomColor = () => {
	return Math.floor(Math.random() * (0xFFFFFF + 1));
};

exports.randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

exports.loadImageUrl = (...urls) => {
	return new Promise((resolve, reject) => {
		var images = [];
		var completed = 0;
		for (var i = 0; i < urls.length; i++) {
			let img = new Image;
			images.push(img);
			requestImage.get(urls[i], (err, res, data) => {
				if (err) reject(err);
				img.onload = () => {
					completed++;
					if (completed == urls.length)
						resolve(images);
				};
				img.src = new Buffer(data, 'base64');
			});
		}
	});
};

exports.uploadImage = (url, uid) => {
	return new Promise((resolve, reject) => {
		request.post(_config.image_hosting.url, {form: {url: url, uid: uid}}, (err, res, body) => {
			if (err) reject(err);
			resolve(body);
		});
	});
};

exports.parser = (args) => {
	return new Promise(async (resolve) => {
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
};

exports.validYoutubeUrl = (url) => {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
	var match = url.match(regExp);
	return (match && match[2].length == 11) ? 1 : 0;
};

exports.getHours = (date) => {
	let h = date.getHours() + 2;
	if (h > 23) h = h - 24;
	return (h < 10 ? '0'+h : h);
};

exports.getMinutes = (date) => {
	let m = date.getMinutes();
	return (m < 10 ? '0'+m : m);
};