const chalk = require('chalk');

class Stats {
  constructor(client) {
    this.client = client;
    this.users = [];
    this.channels = [];
    this.refreshUsers();
    this.refreshLadder();
  }

  static formula(level) {
    if (level === 0) return (21);
    if (level === 1) return (60);
    return (60 * (level ^ 1.6)); // eslint-disable-line no-bitwise
  }

  getExpPercent(level, exp) {
    return Math.round((exp / this.constructor.formula(level + 1)) * 100);
  }

  async updateStats(msg) {
    if (this.users[`${msg.channel.guild.id}${msg.author.id}`]) return;
    if (msg.content.length < 3) return;
    await this.client.database.getUser(msg.author, msg.channel.guild.id);
    const user = await this.client.database.getUserStats(msg.author.id);
    let exp = parseInt(user.exp, 10);
    let points = parseInt(user.points, 10);
    let level = parseInt(user.level, 10);
    exp += this.client.utils.randomNumber(4, 9);
    exp += (msg.mentions.channels.size + msg.mentions.roles.size + msg.mentions.users.size) * 2;
    const nextLevelExp = this.constructor.formula(level + 1);
    if (exp >= nextLevelExp) {
      const plus = exp - nextLevelExp;
      exp = 0;
      if (plus > 0) exp = plus;
      level += 1;
      points += this.client.utils.randomNumber(level, level * 2);
      this.client.database.models.Stats.model.update({
        level,
        exp,
        points,
      }, {
        where: {
          uid: user.uid,
        },
      }).then((row) => {
        if (row[0] < 1) throw new Error(`${row[0]} rows were affected for uid ${user.uid}`);
      });
    } else {
      this.client.database.models.Stats.model.update({
        exp,
      }, {
        where: {
          uid: user.uid,
        },
      }).then((row) => {
        if (row[0] < 1) throw new Error(`${row[0]} rows were affected for uid ${user.uid}`);
      });
    }
    this.users[`${msg.channel.guild.id}${msg.author.id}`] = new Date();
  }

  static sortLadder(a, b) {
    const aLevel = a.dataValues.level;
    const bLevel = b.dataValues.level;
    const aExp = a.dataValues.exp;
    const bExp = b.dataValues.exp;
    if (aLevel < bLevel) return (1);
    if (aLevel > bLevel) return (-1);
    if (aLevel === bLevel && aExp < bExp) return (1);
    else if (aLevel === bLevel) return (-1);
    return (0);
  }

  updateLadder() {
    if (!this.client.database.use) {
      return (console.log(chalk.yellow('Not updating ladder (Database not used)')));
    }
    this.channels.forEach(async (channel) => {
      const channelUsers = await this.client.database.getAllUsers(channel.guild.id);
      const channelUsersUid = channelUsers.map(u => u.uid);
      const usersStat = await this.client.database.getAllUsersStat(channelUsersUid);
      usersStat.sort(this.constructor.sortLadder);
      usersStat.map((u, i) => this.client.database.updateRank(u.uid, i + 1));
      const next = new Date();
      next.setMinutes(next.getMinutes() + 30);
      let ladderContent = '```xl\n';
      await usersStat.forEach((stats, i) => {
        const user = channelUsers.filter(u => u.dataValues.uid === stats.uid)[0];
        const guildUser = channel.members.get(user.dataValues.uid);
        if (guildUser) {
          const percent = this.getExpPercent(stats.level, stats.exp);
          ladderContent += `#${i + 1} \u27A4 ${guildUser.user.username} - Level ${stats.level} (${percent}%)\n`;
        }
      });
      ladderContent += '```\n';
      ladderContent += `Next update at ${this.client.utils.getHours(next)}:${this.client.utils.getMinutes(next)}`;
      const message = (await channel.fetchMessages({ limit: 1 })).first();
      if (message && message.author.id === this.client.user.id) message.edit(ladderContent);
      else channel.send(ladderContent);
    });
    return (console.log(chalk.blue('Ladder updated for every channels !')));
  }

  refreshLadder() {
    setInterval(() => {
      this.updateLadder();
    }, 1800000);
  }

  refreshUsers() {
    setInterval(() => {
      const now = new Date();
      Object.keys(this.users).forEach((k) => {
        if ((now - this.users[k]) >= 120000) delete this.users[k];
      });
    }, 5000);
  }
}

module.exports = Stats;
