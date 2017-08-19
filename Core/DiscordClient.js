const core = require('./index.js');
const DiscordJs = require('discord.js');
const Chinmei = require('chinmei');
const EventEmitter = require('eventemitter3');

class DiscordClient extends DiscordJs.Client {
	constructor() {
		super();
		this.login(_config.discord.token);
		this.discord = DiscordJs;
		this.hfeed = new core.HinataFeed();
		this.database = new core.Database();
		this.importManager = new core.ImportManager(__dirname);
		this.commands = new core.CommandManager();
		this.utils = core.Utils;
		this.deleted = new DiscordJs.Collection();
		this.chinmei = new Chinmei(_config.myanimelist.username, _config.myanimelist.password);
		this.Stats = new core.Stats(this);
	}

	async init() {
		this.user.setGame(_config.discord.game, {type: 0});
		await this.database.authenticate();
		await this.hfeed.init();
		await this.refreshBotChannels();
		await this.Stats.updateLadder();
	}

	async refreshBotChannels() {
		let hfeedChannels = [];
		let ladderChannels = [];
		await Object.keys(this.channels).forEach((k, v) => {
			let channel = this.getChannel(String(k));
			if (channel.name === 'chan_de_bot') {
				hfeedChannels.push(channel);
			}
			if (channel.name === 'ladder') {
				ladderChannels.push(channel);
			}
		});
		this.hfeed.channels = hfeedChannels;
		this.Stats.channels = ladderChannels;
	}
}

module.exports = DiscordClient;