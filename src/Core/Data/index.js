const User = require('./User');
const Guild = require('./Guild');

function DataStore(DiscordJs, database) {
  Object.defineProperty(DiscordJs.User.prototype, 'data', {
    get: function getData() {
      if (!this.storedData) this.storedData = new User(this, database);
      return this.storedData;
    },
  });
  Object.defineProperty(DiscordJs.Guild.prototype, 'data', {
    get: function getData() {
      if (!this.storedData) this.storedData = new Guild(this, database);
      return this.storedData;
    },
  });
}

module.exports = DataStore;
