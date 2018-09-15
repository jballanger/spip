class Feature {
  constructor(client, settings) {
    this.name = new.target.name;
    client.features.push(this.name);
    this.settings = settings;
  }

  async enable(guild, options) {
    const settings = this.getSettings(options);
    if (settings instanceof Error) return (settings.message);
    const guildData = await guild.data.get();
    const status = (guildData.settings[this.name]) ? 'updated' : 'enabled';
    guildData.settings[this.name] = settings;
    guild.data.save();
    return (`${this.name} successfully ${status} !`);
  }

  async disable(guild) {
    const guildData = await guild.data.get();
    delete guildData.settings[this.name];
    guild.data.save();
    return (`${this.name} successfully disabled !`);
  }

  getSettings(options) {
    const featureSettings = {};
    try {
      Object.keys(this.settings).forEach((s) => {
        const setting = this.settings[s];
        const key = Object.keys(options).find(opt => setting.key.indexOf(opt) !== -1);
        featureSettings[s] = (key) ? options[key] : null;
        if (setting.required && !featureSettings[s]) {
          throw new Error(`\`${s}\` is required for **${this.name}**`);
        }
        if (setting.type && typeof featureSettings[s] !== typeof setting.type) {
          throw new Error(`Invalid type for \`${s}\``);
        }
        if (setting.class && (!featureSettings[s] || !featureSettings[s].constructor
            || featureSettings[s].constructor.name !== setting.class)) {
          throw new Error(`Invalid class for \`${s}\``);
        }
        if (setting.property) {
          if (!featureSettings[s][setting.property]) {
            throw new Error(`Undefined property \`${setting.property}\` in \`${s}\``);
          }
          featureSettings[s] = featureSettings[s][setting.property];
        }
      });
    } catch (error) {
      return (error);
    }
    return (featureSettings);
  }
}

module.exports = Feature;
