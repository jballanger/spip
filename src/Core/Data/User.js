const Base = require('./Base');

class UserData extends Base {
  constructor(user, database) {
    super('User', user, database);
  }
}

module.exports = UserData;
