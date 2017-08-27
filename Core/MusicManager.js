const youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

class MusicManager {
	constructor(client) {
		this.client = client;
		this.queue = new this.client.discord.Collection();
		this.youtube = new youtube(_config.youtube.apikey);
		this.voiceChannels = new this.client.discord.Collection();
		this.dispatcher = new this.client.discord.Collection();
		this.volume = new this.client.discord.Collection();
	}

	addSong(data) {
		let guildQueue = this.queue.get(data.guildId);
		if (!guildQueue) {
			this.queue.set(data.guildId, new this.client.discord.Collection());
			this.volume.set(data.guildId, 5);
			guildQueue = this.queue.get(data.guildId);
		}
		let queueSong = guildQueue.first();
		if (!queueSong) {
			guildQueue.set(1, data);
			this.checkQueue(guildQueue);
		}
		else {
			let size = guildQueue.size;
			guildQueue.set(size + 1, data);
			data.msg.reply(':thumbsup: Your song was added to the queue !');
		}
	}

	checkQueue(queue) {
		if (queue.size < 1) return this.client.setTimeout(this.leaveChannels, 15000, this);
		let data = queue.first();
		this.youtube.getVideo(data.url).then((video) => {
			this.play(video, data, queue);
		}).catch(() => {
			this.youtube.searchVideos(data.url, 1).then((videos) => {
				this.youtube.getVideoByID(videos[0].id).then((video) => {
					this.play(video, data, queue);
				}).catch(() => {
					data.msg.reply(`Couldn't obtain the search result video's details for *${data.url}*.`);
					this.rearrange(queue);
				});
			}).catch(() => {
				data.msg.reply(`There were no search results for *${data.url}*.`);
				this.rearrange(queue);
			});
		});
	}

	play(video, data, queue) {
		let playing = data.textChannel.send(`:musical_note: Now playing **${video.title}**, by ${data.msg.author.username}`);
		let streamError = false;
		const stream = ytdl(video.url, {audioonly: true})
			.on('error', err => {
				streamError = true;
				console.error(`Error occured while streaming video: ${err}`);
				playing.edit('Coulnd\'t play ${video.title}, unlucky :^)');
				this.rearrange(queue);
			});
		const dispatcher = data.connection.playStream(stream, {passes: 1})
			.on('end', () => {
				if (streamError) return ;
				this.rearrange(queue);
			})
			.on ('error', err => {
				console.error(`Error occured in dispatcher: ${err}`);
				data.textChannel.send('An error occured while playing ${video.title}, try again :^)');
				this.rearrange(queue);
			});
		dispatcher.setVolumeLogarithmic(this.volume.get(data.guildId) / 5);
		this.voiceChannels.set(data.guildId, data.connection.channel);
		this.dispatcher.set(data.guildId, dispatcher);
	}

	async rearrange(queue) {
		await queue.forEach((e, k, map) => {
			let elem = map.get(k + 1);
			elem ? map.set(k, elem) : map.delete(k);
		});
		this.checkQueue(queue);
	}

	leaveChannels(client) {
		client.queue.forEach(async (e, k, map) => {
			if (e.size < 1) {
				await client.voiceChannels.get(k).leave();
				client.voiceChannels.delete(k);
				map.delete(k);
			}
		});
	}
}

module.exports = MusicManager;