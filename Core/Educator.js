const fs = require('fs');

class Educator {
	constructor(client, path) {
		this.client = client;
		this.loadList(path);
	}

	loadList(path) {
		fs.readFile(path, (err, data) => {
			if (err) return console.error(err);
			this.wlist = data.toString().split('\n');
		});
	}

	isBad(word) {
		if (!this.wlist) return (0);
		return (this.wlist.find((e) => {
			return (e === word);
		}));
	}

	async punish(member, msg) {
		let guild = msg.channel.guild;
		let role = guild.roles.find('name', 'Guignol');
		let time = 0;
		await this.client.database.getUser(member.user, guild.id).then((u) => {time = u.punisher;});
		time === 0 ? time = 2 : time *= 2;
		if (role) {
			member.addRole(role).then(() => {
				msg.channel.send(`<@${member.id}> got punished for ${time} minutes !`);
				this.client.database.models.User.model.update({punisher: time}, {where: {uid: member.id, gid: guild.id}}).then((row) => {
					if (row[0] < 1) throw `${row[0]} rows were affected`;
				});
				this.client.setTimeout(() => {
					member.removeRole(role);
				}, (time * 60000));
			});
		}
	}
}

module.exports = Educator;