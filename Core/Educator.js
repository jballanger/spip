const fs = require('fs');

class Educator {
	constructor(client, path) {
		this.client = client;
	}

	loadList(path) {
		let content = fs.readFileSync(path).toString();
		this.wlist = content.split('\n').filter(String);
	}

	isBad(content) {
		if (!this.wlist) return (0);
		return this.wlist.some((e) => {
			return content.indexOf(e) !== -1;
		});
	}

	async punish(msg) {
		let member = msg.member;
		let guild = msg.channel.guild;
		let role = guild.roles.find('name', 'Guignol');
		let time = 0;
		await this.client.database.getUser(member.user, guild.id).then((u) => {time = u.punisher;});
		parseInt(time, 10) === 0 ? time = 2 : time *= 2;
		if (role) {
			member.addRole(role).then(() => {
				msg.channel.send(`<@${member.id}> is punished for ${time} minutes !`);
				this.client.database.models.User.model.update({punisher: time}, {where: {uid: member.id, gid: guild.id}}).then((row) => {
					if (row[0] < 1) throw `${row[0]} rows were affected`;
				});
				this.client.setTimeout(() => {
					msg.channel.send(`<@${member.id}>'s punishment is now over.`);
					member.removeRole(role);
				}, (time * 60000));
			}).catch((e) => { console.error(`Not enough access to punish ${msg.author.tag} for:\n"${msg.content}"`); });
			if (msg.deletable) msg.delete();
		}
	}
}

module.exports = Educator;