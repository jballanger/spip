const fs = require('fs');

class Educator {
  constructor(client) {
    this.client = client;
  }

  loadList(path) {
    let content = null;
    try {
      content = fs.readFileSync(path).toString();
    } catch (err) {
      if (err.code === 'ENOENT') console.log('Not using Educator (wlist not found)');
      else console.log(`Not using Educator (${err.code} => ${err.message})`);
    }
    this.wlist = content ? content.split('\n').filter(String) : null;
  }

  isBad(content) {
    if (!this.wlist) return (0);
    const str = content.toLowerCase().replace(/\s+/g, ' ');
    return this.wlist.some(e => str.indexOf(e) !== -1);
  }

  async punish(msg) {
    const { member } = msg;
    const { guild } = msg.channel;
    const role = guild.roles.find('name', 'Guignol');
    let time = 0;
    await this.client.database.getUser(member.user, guild.id).then((u) => { time = u.punisher; });
    time = (parseInt(time, 10) === 0) ? 2 : time * 2;
    if (role) {
      member.addRole(role).then(() => {
        msg.channel.send(`<@${member.id}> is punished for ${time} minutes !`);
        this.client.database.models.User.model.update(
          { punisher: time },
          {
            where: {
              uid: member.id,
              gid: guild.id,
            },
          },
        ).then((row) => {
          if (row[0] < 1) throw new Error(`${row[0]} rows were affected`);
        });
        this.client.setTimeout(() => {
          msg.channel.send(`<@${member.id}>'s punishment is now over.`);
          member.removeRole(role);
        }, (time * 60000));
      }).catch(() => { console.error(`Not enough access to punish ${msg.author.tag} for:\n"${msg.content}"`); });
      if (msg.deletable) msg.delete();
    }
  }
}

module.exports = Educator;
