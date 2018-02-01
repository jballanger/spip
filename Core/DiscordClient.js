const core = require('./index.js');
const chalk = require('chalk');
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
    this.user.setActivity(_config.discord.game);
    await this.database.authenticate();
    await this.refreshBotChannels();
    await this.commands.init(this);
    await this.educator.loadList(_config.educator.wlist);
    await this.hfeed.init();
    await this.stats.updateLadder();
    this.registerEvents();
  }

  registerEvents() {
    this.on('message', (msg) => {
      if (msg.author.id === this.user.id) return;
      if (!['Admin', 'Staff'].some(e => msg.member.roles.exists('name', e))) {
        if (this.educator.isBad(msg.content)) {
          this.educator.punish(msg);
          return;
        }
      }
      if (!msg.content.startsWith(this.commands.prefix)) this.stats.updateStats(msg);
      this.commands.handleCommand(msg, msg.content);
    });
    this.on('messageDelete', msg => this.deleted.set(msg.id, msg));
    this.hfeed.on('update', (data, i) => {
      this.hfeed.channels.forEach((channel) => {
        const embed = new this.discord.RichEmbed()
          .setTitle(data.title)
          .setDescription(this.hfeed.messages[i])
          .setURL(data.link)
          .setColor(this.utils.randomColor());
        channel.send({ embed });
      });
    });
    setInterval(() => {
      this.refreshBotChannels();
    }, 60000);
  }

  refreshBotChannels() {
    this.hfeed.channels = this.channels.findAll('name', 'chan_de_bot');
    this.stats.channels = this.channels.findAll('name', 'ladder');
    this.commands.channels = this.channels.findAll('name', 'spip');
    console.log(chalk.blue('Bot channels refreshed !'));
  }
}

module.exports = DiscordClient;
