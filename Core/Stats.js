const chalk = require('chalk');

class Stats {
	constructor(client) {
		this.client = client;
		this.users = [];
		this.channels = [];
		this.refreshUsers();
		this.refreshLadder();
	}

	formula(level) {
		if (level === 0) return (21);
		if (level === 1) return (60);
		return (60 * (level ^ 1.6));
	}

	getExpPercent(level, exp) {
		return Math.round((exp / this.formula(level + 1)) * 100);
	}

	updateStats(msg) {
		if (this.users[msg.channel.guild.id+msg.author.id]) return ;
		if (msg.content.length < 3) return ;
		this.client.database.getUser(msg.author, msg.channel.guild.id).then((user) => {
			let exp = parseInt(user.exp, 10);
			let points = parseInt(user.points, 10);
			let level = parseInt(user.level, 10);

			exp += this.client.utils.randomNumber(4, 9);
			exp += (msg.mentions.channels.size + msg.mentions.roles.size + msg.mentions.users.size) * 2;

			let nextLevelExp = this.formula(level + 1);
			if (exp >= nextLevelExp) {
				let plus = exp - nextLevelExp;
				exp = 0;
				if (plus > 0) exp = plus;
				level += 1;
				points += this.client.utils.randomNumber(level, level * 2);
				this.client.database.models.User.model.update({level: level, exp: exp, points: points}, {where: {uid: user.uid, gid: msg.channel.guild.id}}).then((row) => {
					if (row[0] < 1) throw `${row[0]} rows were affected`;
				});
			} else {
				this.client.database.models.User.model.update({exp: exp}, {where: {uid: user.uid, gid: msg.channel.guild.id}}).then((row) => {
					if (row[0] < 1) throw `${row[0]} rows were affected`;
				});
			}
		});
		this.users[msg.channel.guild.id+msg.author.id] = new Date();
	}

	sortLadder(a, b) {
		let aLevel = a.dataValues.level;
		let bLevel = b.dataValues.level;
		let aExp = a.dataValues.exp;
		let bExp = b.dataValues.exp;
		if (aLevel < bLevel)
			return 1;
		if (aLevel > bLevel)
			return -1;
		if (aLevel === bLevel && aExp < bExp)
			return 1;
		else if (aLevel === bLevel)
			return -1;
		return 0;
	}

	updateLadder() {
		if (!this.client.database.use) {
			return (console.log(chalk.yellow('Not updating ladder (Database not used)')));
		}
		this.channels.forEach((channel) => {
			this.client.database.getAllUsers(channel.guild.id).then(async (users) => {
				await users.sort(this.sortLadder);
				await users.map((u, i) => this.client.database.updateRank(u.id, i + 1));
				let next = new Date();
				next.setMinutes(next.getMinutes() + 30);
				let ladderContent = '```xl\n';
				if (users.length < 1) ladderContent += '\n';
				await users.forEach((user, i) => {
					let percent = this.getExpPercent(user.level, user.exp);
					ladderContent += `#${i + 1} \u27A4 ${user.username} - Level ${user.level} (${percent}%)\n`;
				});
				ladderContent += '```\n';
				ladderContent += `Next update at ${this.client.utils.getHours(next)}:${this.client.utils.getMinutes(next)}`;
				channel.fetchMessages({limit: 1}).then((messages) => {
					let message = messages.first();
					if (message && message.author.id === this.client.user.id) {
						message.edit(ladderContent);
					}
					else channel.send(ladderContent);
				});
			});
		});
		console.log(chalk.blue('Ladder updated for every channels !'));
	}

	refreshLadder() {
		setInterval(() => {
			this.updateLadder();
		}, 1800000);
	}

	refreshUsers() {
		setInterval(() => {
			let now = new Date();
			Object.keys(this.users).forEach(k => (((now - this.users[k]) >= 120000) && delete this.users[k]));
		}, 5000);
	}
}

module.exports = Stats;
