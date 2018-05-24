class Feature {
  constructor(client) {
    this.name = new.target.name;
    client.features.push(this.name);
  }

  async enable(guild, options) {
    const guildData = await guild.data.get();
    const { settings } = guildData;
    settings[this.name] = options;
    await guild.data.save();
    return `${this.name} successfully enabled !`;
  }

  /* disable(guild) {

  } */
}

module.exports = Feature;
