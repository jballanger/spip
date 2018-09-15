const Base = require('./Base');

class GuildData extends Base {
  constructor(guild, database) {
    super('Guild', guild, database);
  }
}

module.exports = GuildData;
