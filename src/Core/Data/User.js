// const { Collection } = require('discord.js');

class UserData {
  constructor(user, database) {
    this.id = parseInt(user.id, 10);
    this.database = database;
  }

  get() {
    return new Promise((resolve) => {
      this.database.models.User.model.findOrCreate({
        where: {
          id: this.id,
        },
      }).spread(u => resolve(u.dataValues));
    });
  }
}

module.exports = UserData;
