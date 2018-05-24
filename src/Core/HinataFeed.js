const fetch = require('node-fetch');
const Feature = require('./Feature');

class HinataFeed extends Feature {
  constructor(client) {
    super(client);
    this.client = client;
    this.source = 'https://hinata-online-community.fr/wp-content/themes/hinata_v6/bot.json';
    this.messages = [
      'Nouvelle page d\'accueil !',
      '',
      'Nouvel anime !',
      ':tada: Welcome & good luck :^) :tada:',
      'Nouveau Zoom Anime !',
    ];
  }

  async init() {
    this.feed = await this.getFeed();
    this.channels = this.initChannels();
    // setInterval(this.watchFeed, 30000);
    console.log('HinataFeed initiated !');
  }

  async initChannels() {
    const channels = [];
    const { guilds } = this.client;
    guilds.forEach(async (guild) => {
      const guildData = await guild.data.get();
      const { settings } = guildData;
      if (settings.hinataFeed) {
        const { channel } = settings.hinataFeed;
        if (channel) channels.push(channel);
      }
    });
    return channels;
  }

  getFeed() {
    return new Promise((resolve, reject) => {
      fetch(this.source)
        .then((res) => {
          if (!res.ok) reject(res.statusText);
          res.json().then(body => resolve(body));
        })
        .catch(err => reject(err));
    });
  }

  async watchFeed() {
    const feed = await this.getFeed();
    Object.keys(feed).forEach((key, value) => {
      if (this.feed[key] !== feed[key]) {
        this.update(key, value);
        this.feed[key] = feed[key];
      }
    });
  }

  update(type, data) {
    this.channels.forEach((channelId) => {
      const channel = this.client.channels.get(channelId);
      if (channel) {
        const embed = new this.discord.RichEmbed()
          .setTitle(data.title)
          .setDescription(this.hfeed.messages[type])
          .setURL(data.link)
          .setColor(this.client.utils.randomColor());
        channel.send({ embed });
      }
    });
  }

  settings(options) {
    const settings = {};
    if (options.channel && typeof options.channel === 'string') {
      const channelPattern = this.client.discord.MessageMentions.CHANNELS_PATTERN;
      const channel = this.client.utils.mtoi(channelPattern, options.channel);
      if (!channel) return null;
      settings.channel = channel;
    }
    if (!settings.channel) return null;
    return settings;
  }
}

module.exports = HinataFeed;
