const http = require('http');
const fs = require('fs');
const EventEmitter = require('eventemitter3');

class HinataFeed {
	constructor() {
		this.source = 'http://hinata-online-community.fr/wp-content/themes/hinata_v6/bot.json';
		this.feed = {};
		this.emitter = new EventEmitter();
	}
	init() {
		let loop = setInterval(() => {
			let currentFeed = fs.createWriteStream('feed.json');
			http.get(this.source, response => {
				response.pipe(currentFeed);
				//this.compareFeed();
			});
		}, 1000);
		fs.readFile('feed.json', 'utf8', (err, data) => {
			if (err) throw err;
			this.feed = JSON.parse(data);
		});
	}
	compareFeed() {
		fs.readFileSync('feed.json', 'utf8', (err, data) => {
			if (err) throw err;
			let newFeed = JSON.parse(data);
			if (newFeed !== this.feed)
				updateFeed(newFeed);
			else
				console.log('no diff');
		});
	}
	updateFeed(newFeed) {
		console.log(newFeed);
	}
}

module.exports = HinataFeed;