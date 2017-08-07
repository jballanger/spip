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
				logging: false,
				define: {
					timestamps: false
				}
			});
	}

	async authenticate() {
		try {
			if (this.use) {
				console.log(chalk.yellow('Connecting to database..'));
				await this.sequelize.authenticate();
				console.log(chalk.blue('Connected to database !'));
				console.log(chalk.yellow('Loading models..'));
				await this.loadModels();
				console.log(chalk.blue(`${Object.keys(this.models).length || '0'} models loaded !`));
			} else {
				console.log(chalk.yellow('Not connecting to the database (Database informations missing in config)'));
			}
		} catch (err) {
			console.error(chalk.red(`Failed to connect to the database, retrying in 5 seconds..\n${err}`));
			await this.sleep(5000);
			return await this.authenticate();
		}
	}

	getUser(user) {
		return new Promise((resolve, reject) => {
			this.models.User.model.findOrCreate({
				where: {
					uid: user.id
				},
				defaults: {
					uid: user.id,
					username: user.username,
					level: '0',
					exp: '0',
					rank: '999',
					points: '0',
					background: ''
				}
			}).spread((user, created) => {
				resolve(user.dataValues);
			});
		});
	}

	async loadModels() {
		const models = require('./Models');
		this.models = {};
		for (const key in models) {
			this.models[key] = new models[key](this.sequelize);
			await this.models[key].model.sync();
		}
	}

	sleep(time) {
		return new Promise((res, rej) => {
			setTimeout(res, time);
		});
	}
}

module.exports = Database;