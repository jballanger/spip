const fetch = require('node-fetch');
const deepDiff = require('deep-diff');
const Feature = require('./Feature');

class Feed extends Feature {
  constructor(client) {
    super(client, {
      channel: {
        key: ['c', 'channel'],
        type: {},
        class: 'TextChannel',
        property: 'id',
        required: true,
      },
      url: {
        key: ['u', 'url'],
        type: 'string',
        required: true,
      },
    });
    this.client = client;
    this.feeds = {};
  }

  async init() {
    setInterval(this.watch.bind(this), 60000);
    console.log('Feed initiated !');
  }

  watch() {
    this.client.guilds.forEach(async (guild) => {
      const guildData = await guild.data.get();
      if (guildData.settings.Feed) {
        const feedSettings = guildData.settings.Feed;
        const channel = guild.channels.get(feedSettings.channel);
        if (!channel) return;
        try {
          const res = await fetch(feedSettings.url);
          const json = await res.json();
          if (!this.feeds[guild.id]) this.feeds[guild.id] = json;
          else {
            const diff = this.compareFeed(this.feeds[guild.id], json);
            if (diff) {
              diff.forEach((d) => {
                channel.send({ embed: d });
              });
              this.feeds[guild.id] = json;
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  compareFeed(feed, newFeed) {
    let res = null;
    const diffs = deepDiff(feed, newFeed);
    if (diffs) {
      const used = [];
      diffs.forEach((diff) => {
        if (diff.kind !== 'D' && diff.path.length > 1) {
          const key = diff.path[diff.path.length - 2];
          if (used.includes(key)) return;
          const embed = new this.client.discord.RichEmbed()
            .setTitle(newFeed[key].title || '?')
            .setDescription(newFeed[key].description || '')
            .setURL(newFeed[key].link || '#')
            .setColor(this.client.utils.randomColor());
          if (!res) res = [];
          res.push(embed);
          used.push(key);
        }
      });
    }
    return (res);
  }
}

module.exports = Feed;
