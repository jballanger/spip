const core = require('./index.js');
const Eris = require('eris');
const Chinmei = require('chinmei');
const EventEmitter = require('eventemitter3');

class DiscordClient extends Eris.Client {
	constructor() {
		super(_config.discord.token, {
			autoreconnect: true,
			disableEvents: {
				TYPING_START: true,
				VOICE_STATE_UPDATE: true
			},
			getAllUsers: true,
			restMode: true,
			defaultImageFormat: 'png',
			defaultImageSize: 512,
			messageLimit: 10
		});
		this.hfeed = new core.HinataFeed();
		this.database = new core.Database();
		this.importManager = new core.ImportManager(__dirname);
		this.commands = new core.CommandManager();
		this.utils = core.Utils;
		this.deleted = new Eris.Collection();
		this.chinmei = new Chinmei(_config.myanimelist.username, _config.myanimelist.password);
	}

	async init() {
		this.editStatus('online', this.utils.game(_config.discord.game));
		await this.database.authenticate();
		await this.hfeed.init();
		await this.refreshBotChannels();
	}

	async refreshBotChannels() {
		let botChannels = [];
		await Object.keys(this.channelGuildMap).forEach((k, v) => {
			let channel = this.getChannel(String(k));
			if (channel.name === 'chan_de_bot') {
				botChannels.push(channel);
			}
		});
		this.hfeed.channels = botChannels;
	}
}

module.exports = DiscordClient;