const sequelize = require('sequelize');

class UserModel {
	constructor(db) {
		this.Sequelize = sequelize;
		this.model = db.define('user', {
			id: {
				type: this.Sequelize.BIGINT,
				unique: true,
				primaryKey: true,
				autoIncrement: true
			},
			uid: {
				type: this.Sequelize.BIGINT,
				allowNull: false
			},
			level: {
				type: this.Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			exp: {
				type: this.Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			rank: {
				type: this.Sequelize.INTEGER,
				allowNull: false
			},
			points: {
				type: this.Sequelize.INTEGER,
				allowNull: false
			},
			background: {
				type: this.Sequelize.STRING(256),
				allowNull: true
			}
		});
	}
}

module.exports = UserModel;