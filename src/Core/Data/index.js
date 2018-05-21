const User = require('./User');

function DataStore(DiscordJs, database) {
  Object.defineProperty(DiscordJs.User.prototype, 'data', {
    get: function getData() {
      if (!this.storedData) this.storedData = new User(this, database);
      return this.storedData;
    },
    set: function setData(obj) {
      console.log('setting', obj);
    },
  });
}

module.exports = DataStore;
