const fetch = require('node-fetch');
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
      console.log('HinataFeed initiated !');
    }).catch((e) => {
      throw e;
    });
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
