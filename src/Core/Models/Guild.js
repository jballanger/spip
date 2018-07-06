const sequelize = require('sequelize');

class GuildModel {
  constructor(db) {
    this.Sequelize = sequelize;
    this.model = db.define('guild', {
      id: {
        type: this.Sequelize.BIGINT,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      settings: {
        type: this.Sequelize.JSON,
        defaultValue: {},
      },
      joinedAt: this.Sequelize.DATE,
      createdAt: this.Sequelize.DATE,
      updatedAt: this.Sequelize.DATE,
    });
  }
}

module.exports = GuildModel;
