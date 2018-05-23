class UserData {
  constructor(user, database) {
    this.id = parseInt(user.id, 10);
    this.database = database;
  }

  get() {
    return new Promise((resolve) => {
      if (this.userData) resolve(this.userData);
      else {
        this.database.models.User.findOrCreate({
          where: {
            id: this.id,
          },
        }).spread(({ dataValues }) => {
          this.userData = dataValues;
          resolve(dataValues);
        });
      }
    });
  }

  save() {
    return new Promise((resolve) => {
      if (!this.userData) throw new Error('User wasn\'t get(ed) before using save().');
      this.database.models.User.update(
        this.userData,
        { where: { id: this.userData.id } },
      ).then((row) => {
        const rowCount = row[0];
        if (rowCount < 1) console.log(`${rowCount} row were updated when saving the User`, this.userData);
        else resolve();
      });
    });
  }
}

module.exports = UserData;
