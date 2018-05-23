class GuildData {
  constructor(guild, database) {
    this.id = parseInt(guild.id, 10);
    this.database = database;
  }

  get() {
    return new Promise((resolve) => {
      if (this.guildData) resolve(this.guildData);
      else {
        this.database.models.Guild.findOrCreate({
          where: {
            id: this.id,
          },
        }).spread(({ dataValues }) => {
          this.guildData = dataValues;
          resolve(dataValues);
        });
      }
    });
  }

  save() {
    return new Promise((resolve) => {
      if (!this.guildData) throw new Error('Guild wasn\'t get(ed) before using save().');
      this.database.models.Guild.update(
        this.guildData,
        { where: { id: this.GuildData.id } },
      ).then((row) => {
        const rowCount = row[0];
        if (rowCount < 1) console.log(`${rowCount} row were updated when saving the Guild`, this.guildData);
        else resolve();
      });
    });
  }
}

module.exports = GuildData;
