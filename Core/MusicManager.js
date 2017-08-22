const youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

class MusicManager {
	constructor(client) {
		this.client = client;
		this.queue = new this.client.discord.Collection();
		this.youtube = new youtube(_config.youtube.apikey);
	}

	addSong(data) {
		let guildQueue = this.queue.get(data.guildId);
		if (!guildQueue) {
			this.queue.set(data.guildId, new this.client.discord.Collection());
			guildQueue = this.queue.get(data.guildId);
		}
		let queueSong = guildQueue.first();
		if (!queueSong) {
			guildQueue.set('1', data);
			this.checkQueue(guildQueue);
		}
		else {
			let size = guildQueue.size;
			guildQueue.set(size + 1, data);
		}
	}

	checkQueue(queue) {
		if (queue.size < 1) return ;
		let data = queue.first();
		this.youtube.getVideo(data.url).then((video) => {
			this.play(video, data, queue);
		}).catch(() => {
			this.youtube.searchVideos(data.url, 1).then((videos) => {
				this.youtube.getVideoByID(videos[0].id).then((video) => {
					this.play(video, data, queue);
				}).catch(() => {
					data.textChannel.send('Couldn\'t obtain the search result video\'s details.');
					this.rearrange(queue);
				});
			}).catch((e) => {
				data.textChannel.send('There were no search results.');
				this.rearrange(queue);
			});
		});
	}

	play(video, data, queue) {
		const playing = data.textChannel.send(`:musical_note: Now playing ${video.title}, by ${data.author.username}`);
		let streamError = false;
		const stream = ytdl(video.url, {audioonly: true})
			.on('error', err => {
				streamError = true;
				console.error(`Error occured while streaming video: ${err}`);
				playing.edit('Coulnd\'t play ${video.title}, unlucky :^)');
				this.rearrange(queue);
				this.checkQueue(queue);
			});
		const dispatcher = data.connection.playStream(stream, {passes: 1})
			.on('end', () => {
				if (streamError) return ;
				this.rearrange(queue);
				this.checkQueue(queue);
			})
			.on ('error', err => {
				console.error(`Error occured in dispatcher: ${err}`);
				data.textChannel.send('An error occured while playing ${video.title}, try again :^)');
				this.rearrange(queue);
				this.checkQueue(queue);
			});
	}

	rearrange(queue) {
		queue.delete('1');
		queue.map(k => k = k - 1);
	}
}

module.exports = MusicManager;