class Base {
  constructor(model, object, database) {
    this.id = parseInt(object.id, 10);
    this.database = database;
    this.model = model;
  }

  get() {
    return new Promise((resolve) => {
      if (this.data) resolve(this.data);
      else {
        this.database.models[this.model].findOrCreate({
          where: {
            id: this.id,
          },
        }).spread(({ dataValues }) => {
          this.data = dataValues;
          resolve(dataValues);
        });
      }
    });
  }

  save() {
    return new Promise((resolve) => {
      if (!this.data) throw new Error(`${this.model} wasn't get(ed) before using save().`);
      this.database.models[this.model].update(
        this.data,
        { where: { id: this.id } },
      ).then((row) => {
        const rowCount = row[0];
        if (rowCount < 1) console.log(`${rowCount} row were updated when saving the ${this.model}`, this.data);
        else resolve();
      });
    });
  }
}

module.exports = Base;
