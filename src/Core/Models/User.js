const sequelize = require('sequelize');

class UserModel {
  constructor(db) {
    this.Sequelize = sequelize;
    this.model = db.define('user', {
      id: {
        type: this.Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      gid: {
        type: this.Sequelize.TEXT,
        allowNull: false,
      },
      uid: {
        type: this.Sequelize.TEXT,
        allowNull: false,
      },
      punisher: {
        type: this.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: this.Sequelize.DATE,
      updatedAt: this.Sequelize.DATE,
    });
  }
}

module.exports = UserModel;
