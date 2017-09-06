const core = require('./index.js');
const DiscordJs = require('discord.js');
const Chinmei = require('chinmei');

class DiscordClient extends DiscordJs.Client {
	constructor() {
		super();
		this.login(_config.discord.token);
		this.discord = DiscordJs;
		this.hfeed = new core.HinataFeed();
		this.database = new core.Database();
		this.educator = new core.Educator(this);
		this.importManager = new core.ImportManager(__dirname);
		this.commands = new core.CommandManager();
		this.utils = core.Utils;
		this.deleted = new DiscordJs.Collection();
		this.chinmei = new Chinmei(_config.myanimelist.username, _config.myanimelist.password);
		this.stats = new core.Stats(this);
		this.musicManager = new core.MusicManager(this);
	}

	async init() {
		this.user.setGame(_config.discord.game);
		await this.database.authenticate();
		await this.educator.loadList('Misc/wlist.txt');
		await this.hfeed.init();
		await this.refreshBotChannels();
		await this.stats.updateLadder();
	}

	async refreshBotChannels() {
		this.hfeed.channels = this.channels.findAll('name', 'chan_de_bot');
		this.stats.channels = this.channels.findAll('name', 'ladder');
		this.commands.channels = this.channels.findAll('name', 'spip');
	}
}

module.exports = DiscordClient;