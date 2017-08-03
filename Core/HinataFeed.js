const request = require('request');
const EventEmitter = require('eventemitter3');

class HinataFeed extends EventEmitter{
	constructor() {
		super();
		this.source = 'http://localhost/hoc/wp-content/themes/hinata_v6/bot.json';
		this.feed = {};
		this.channels = [];
		this.messages = [
			''
		];
	}
	
	init() {
		this.getFeed().then((feed) => {
			this.feed = feed;
			this.watchFeed();
		}).catch((e) => {
			throw e;
		});
	}

	getFeed() {
		return new Promise((resolve, reject) => {
			request({url: this.source, json: true}, (err, res, body) => {
				if (err) reject(err);
				if (res.statusCode === 200) {
					resolve(body);
				} else {
					reject(new Error(res.body+'\n'+res.statusCode));
				}
			});
		});
	}

	watchFeed() {
		setInterval(() => {
			this.getFeed().then((feed) => {
				Object.keys(feed).forEach((k, v) => {
					if (this.feed[k].title !== feed[k].title) {
						this.emit('update', feed[k], v);
						this.feed[k] = feed[k];
					}
				});
			}).catch((e) => {
				throw e;
			});
		}, 2000);
	}
}

module.exports = HinataFeed;