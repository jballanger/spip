const sequelize = require('sequelize');

class StatsModel {
  constructor(db) {
    this.Sequelize = sequelize;
    this.model = db.define('stats', {
      id: {
        type: this.Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      uid: {
        type: this.Sequelize.TEXT,
        allowNull: false,
      },
      rank: {
        type: this.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1000,
      },
      level: {
        type: this.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      exp: {
        type: this.Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      points: {
        type: this.Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: this.Sequelize.DATE,
      updatedAt: this.Sequelize.DATE,
    });
  }
}

module.exports = StatsModel;
