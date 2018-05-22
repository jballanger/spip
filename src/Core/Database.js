const Sequelize = require('sequelize');
const models = require('./Models');

class Database {
  constructor() {
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
    this.connectRetry = 0;
  }

  async authenticate() {
    try {
      console.log('Connecting to the database..');
      await this.sequelize.authenticate();
      console.log('Connected !');
      console.log('Loading models..');
      await this.loadModels();
      console.log(`${Object.keys(this.models).length || '0'} models loaded !`);
      return (1);
    } catch (err) {
      if (this.connectRetry > 4) {
        throw new Error(`Failed to connect to the database ${this.connectRetry} times, exiting..`);
      }
      this.connectRetry += 1;
      console.error('Failed to connect to the database, retrying in 5 seconds..\n', err);
      await this.constructor.sleep(5000);
      return (this.authenticate());
    }
  }

  async loadModels() {
    this.models = {};
    Object.keys(models).forEach((model) => {
      this.models[model] = new models[model](this.sequelize).model;
      this.models[model].sync();
    });
  }

  static sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}

module.exports = Database;
