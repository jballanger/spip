class Stats {
  constructor(client) {
    this.client = client;
    this.users = {};
    this.guilds = {};
    this.exponent = 1.7;
    this.baseExp = 60;
  }

  getLevel(exp) {
    return (Math.floor((exp / this.baseExp) ** (1 / this.exponent)));
  }

  getLevelExp(level) {
    return (Math.round(this.baseExp * (level ** this.exponent)));
  }

  getPercent(level, exp) {
    const levelExp = this.getLevelExp(level);
    const nextLevelExp = this.getLevelExp(level + 1);
    return (Math.round(((exp - levelExp) * 100) / (nextLevelExp - levelExp)));
  }

  getRank(guildId, userId) {
    const guild = this.guilds[guildId];
    if (!guild) return (0);
    const rank = guild.findIndex(member => member.id === userId) + 1;
    return (rank);
  }

  async init() {
    await this.update();
    setInterval(this.update.bind(this), 1800000);
  }

  async update() {
    await this.updateGuilds();
    this.sortGuilds();
  }

  async updateGuilds() {
    const guildsMap = this.client.guilds.map(async (guild) => {
      this.guilds[guild.id] = [];
      const membersMap = guild.members.map(async (member) => {
        const userData = await member.user.data.get();
        this.guilds[guild.id].push({
          id: member.id,
          exp: userData.exp,
        });
      });
      await Promise.all(membersMap);
    });
    await Promise.all(guildsMap);
  }

  sortGuilds() {
    Object.keys(this.guilds).forEach((key) => {
      const guild = this.guilds[key];
      guild.sort((a, b) => a.exp < b.exp);
    });
  }

  async updateStats(msg) {
    const { member, mentions } = msg;
    const { user } = member;
    const now = new Date();
    if (msg.content.length < 3) return;
    if (this.users[user.id] && (now - this.users[user.id]) < 120000) return;
    const userData = await user.data.get();
    userData.exp += this.client.utils.randomNumber(4, 9);
    userData.exp += (mentions.channels.size + mentions.members.size + mentions.roles.size) * 2;
    user.data.save();
    this.users[user.id] = new Date();
  }
}

module.exports = Stats;
