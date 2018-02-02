const chalk = require('chalk');
const Sequelize = require('sequelize');

class Database {
  constructor() {
    this.use = _config.database.mysql.host;
    this.sequelize = new Sequelize(
      _config.database.mysql.database,
      _config.database.mysql.user,
      _config.database.mysql.pass, {
        host: _config.database.mysql.host,
        dialect: 'mysql',
        logging: false,
        define: {
          timestamps: false,
        },
      },
    );
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
      await this.constructor.sleep(5000);
      return this.authenticate();
    }
  }

  getUser(user, gid) {
    return new Promise((resolve) => {
      this.models.User.model.findOrCreate({
        where: {
          gid,
          uid: user.id,
        },
        defaults: {
          gid,
          uid: user.id,
          username: user.username,
          level: '0',
          exp: '0',
          rank: '999',
          points: '0',
          background: '',
          punisher: '0',
        },
      }).spread((u) => {
        resolve(u.dataValues);
      });
    });
  }

  getAllUsers(gid) {
    return new Promise((resolve) => {
      resolve(this.models.User.model.findAll({
        where: {
          gid,
        },
      }));
    });
  }

  updateRank(id, rank) {
    this.models.User.model.update({
      rank,
    }, {
      where: {
        id,
      },
    }).then((row) => {
      if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
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

  static sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}

module.exports = Database;
