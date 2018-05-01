const chalk = require('chalk');
const Sequelize = require('sequelize');
const models = require('./Models');

class Database {
  constructor() {
    this.use = _config.database.mysql.host;
    this.sequelize = new Sequelize(
      _config.database.mysql.database,
      _config.database.mysql.user,
      _config.database.mysql.pass, {
        host: _config.database.mysql.host,
        dialect: 'mysql',
        operatorsAliases: false,
        logging: false,
        define: {
          timestamps: true,
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
      return (1);
    } catch (err) {
      console.error(chalk.red(`Failed to connect to the database, retrying in 5 seconds..\n${err}`));
      await this.constructor.sleep(5000);
      return (this.authenticate());
    }
  }

  initUserStats(uid) {
    return new Promise(async (resolve) => {
      const stats = await this.models.Stats.model.create({ uid });
      resolve(stats);
    });
  }

  async getUser(user, gid) {
    return new Promise((resolve) => {
      this.models.User.model.findOrCreate({
        where: {
          gid,
          uid: user.id,
        },
      }).spread(async (u, created) => {
        if (created) await this.initUserStats(user.id);
        resolve(u.dataValues);
      });
    });
  }

  async getUserStats(uid) {
    return new Promise(async (resolve) => {
      const userStats = await this.models.Stats.model.findOne({ where: { uid } });
      resolve(userStats.dataValues);
    });
  }

  getAllUsers(gid) {
    return new Promise((resolve) => {
      resolve(this.models.User.model.findAll({
        where: { gid },
      }));
    });
  }

  getAllUsersStat(uids) {
    return new Promise((resolve) => {
      resolve(this.models.Stats.model.findAll({
        where: { uid: uids },
      }));
    });
  }

  updateRank(uid, rank) {
    this.models.Stats.model.update(
      { rank },
      { where: { uid } },
    ).then((row) => {
      if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
    });
  }

  async loadModels() {
    this.models = {};
    Object.keys(models).forEach((model) => {
      this.models[model] = new models[model](this.sequelize);
      this.models[model].model.sync();
    });
  }

  static sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}

module.exports = Database;
