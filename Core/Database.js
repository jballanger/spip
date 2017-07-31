const chalk = require('chalk');
const sequelize = require('sequelize');

class Database {
	constructor() {
		this.use = _config.database.postgres.host ? true : false;
		this.sequelize = new sequelize(_config.database.postgres.database,
			_config.database.postgres.user,
			_config.database.postgres.pass, {
				host: _config.database.postgres.host,
				dialect: 'postgres',
				logging: false
			});
	}

	async authenticate() {
		try {
			if (this.use) {
				console.log(chalk.yellow('Connecting to database..'));
				await this.sequelize.authenticate();
				console.log(chalk.blue('Connected to database !'));
			} else {
				console.log(chalk.yellow('Not connecting to the database (Database informations missing in config).'));
			}
		} catch (err) {
			console.error(chalk.red(`Failed to connect to the database, retrying in 5 seconds..\n${err}`));
			await this.sleep(5000);
			return await this.authenticate();
		}
	}

	sleep(time) {
		return new Promise((res, rej) => {
			setTimeout(res, time);
		});
	}
}

module.exports = Database;