const sequelize = require('sequelize');

class UserModel {
  constructor(db) {
    this.Sequelize = sequelize;
    this.model = db.define('user', {
      id: {
        type: this.Sequelize.BIGINT,
        unique: true,
        primaryKey: true,
        allowNull: false,
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
      punisher: {
        type: this.Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: this.Sequelize.DATE,
      updatedAt: this.Sequelize.DATE,
    });
  }
}

module.exports = UserModel;
