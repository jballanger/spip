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