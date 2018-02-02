const chalk = require('chalk');
const request = require('request');
const EventEmitter = require('eventemitter3');

class HinataFeed extends EventEmitter {
  constructor() {
    super();
    this.source = 'https://hinata-online-community.fr/wp-content/themes/hinata_v6/bot.json';
    this.feed = {};
    this.channels = [];
    this.messages = [
      'Nouvelle page d\'accueil !',
      '',
      'Nouvel anime !',
      ':tada: Welcome & good luck :^) :tada:',
      'Nouveau Zoom Anime !',
    ];
  }

  async init() {
    await this.getFeed().then((feed) => {
      this.feed = feed;
      this.watchFeed();
      console.log(chalk.blue('HinataFeed initiated !'));
    }).catch((e) => {
      throw e;
    });
  }

  getFeed() {
    return new Promise((resolve, reject) => {
      request({ url: this.source, json: true }, (err, res, body) => {
        if (err) reject(err);
        if (res && res.statusCode === 200) {
          if (res.statusCode === 200) resolve(body);
          else reject(new Error(`${res.body}\n${res.statusCode}`));
        } else reject(new Error('res is undefined'));
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
