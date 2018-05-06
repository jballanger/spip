const fs = Promise.promisifyAll(require('fs'));

class Educator {
  constructor(client) {
    this.client = client;
    this.wlist = null;
    this.guilds = new this.client.discord.Collection();
  }

  loadList(path) {
    return new Promise(async (resolve, reject) => {
      try {
        const content = (await fs.readFileAsync(path)).toString();
        this.wlist = content.split('\n').filter(String);
        console.log('Educator initiated !');
        resolve();
      } catch (e) {
        if (e.code === 'ENOENT') console.log('Not using Educator (wlist not found)');
        else reject(e);
      }
    });
  }

  createCollection(gid) {
    this.guilds.set(gid, new this.client.discord.Collection());
    return this.guilds.get(gid);
  }

  isBad(content) {
    if (!this.wlist) return (0);
    const str = content.toLowerCase().replace(/[\s+\-=~[&/|#,+()$~%.'":*?<>{}\]]+/g, '');
    return this.wlist.some(e => str.indexOf(e) !== -1);
  }

  static removePunishment(educator, gid, member, role) {
    try {
      const guignols = educator.guilds.get(gid);
      member.removeRole(role);
      if (guignols) guignols.delete(member.id);
    } catch (e) {
      if (e.code === 50013) {
        console.log(`Not enough access to remove punishment to ${member.id}`);
      } else {
        console.log(`Couldn't remove punishment to ${member.id}`);
        throw new Error(e);
      }
    }
  }

  async punish(msg) {
    const { member } = msg;
    const { guild } = msg.channel;
    const role = guild.roles.find('name', 'Guignol');
    if (!role) {
      console.log(`Couldn't punish ${msg.author.tag} for:\n"${msg.content}"\n (No role 'Guignol')`);
      return;
    }
    if (msg.deletable) msg.delete();
    const user = await this.client.database.getUser(member.user, guild.id);
    user.punisher = parseInt(user.punisher, 10);
    const time = (user.punisher === 0) ? 2 : user.punisher * 2;
    try {
      await member.addRole(role);
      const date = new Date();
      date.setMinutes(date.getMinutes() + time);
      const guignols = this.guilds.get(member.guild.id) || this.createCollection(member.guild.id);
      this.client.setTimeout(
        this.constructor.removePunishment,
        (time * 60000),
        this, guild.id, member, role.id,
      );
      guignols.set(member.id, date);
      const row = await this.client.database.models.User.model.update(
        { punisher: time },
        { where: { uid: member.id, gid: guild.id } },
      );
      if (row[0] < 1) throw new Error(`${row[0]} rows were affected (${member.id})`);
      else {
        msg.reply({
          files: [{
            attachment: `${process.cwd()}/src/Misc/educator/bad.png`,
            name: 'bad.png',
          }],
        });
      }
    } catch (e) {
      if (e.code === 50013) {
        console.log(`Not enough access to punish ${msg.author.tag} for:\n"${msg.content}"`);
      } else {
        console.log(`Couldn't punish ${msg.author.tag} for:\n"${msg.content}"`);
        throw new Error(e);
      }
    }
  }
}

module.exports = Educator;
