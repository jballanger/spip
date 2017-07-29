const sequelize = require('sequelize');

class Database {
	constructor() {
		this.sequelize = new sequelize(_config.database.postgres.database,
			_config.database.postgres.user,
			_config.database.postgres.pass, {
				host: _config.database.postgres.host,
				dialect: 'postgres'
			});
	}

	async authenticate() {
		try {
			await this.sequelize.authenticate();
			console.log('Connected to database !');
		} catch (err) {
			console.error('Failed to connect to the database, retrying in 5 seconds', err);
			await this.sleep(5000);
			return await this.authenticate();
		}
	}
}

module.exports = Database;