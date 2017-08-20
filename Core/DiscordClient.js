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
		this.channels.find('name', 'musique').send('Bonsoir :^)');
	}

	async refreshBotChannels() {
		this.hfeed.channels = this.channels.findAll('name', 'chan_de_bot');
		this.Stats.channels = this.channels.findAll('name', 'ladder');
	}
}

module.exports = DiscordClient;