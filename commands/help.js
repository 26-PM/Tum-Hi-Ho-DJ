const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all commands',
  async execute(message) {
    const prefix = process.env.PREFIX || '.';
    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('🎧 Commands')
      .setDescription(
        [
          `\`${prefix}join\` — join your voice channel`,
          `\`${prefix}play <song>\` — play or queue a song`,
          `\`${prefix}insert <song>\` — play a song next`,
          `\`${prefix}skip\` — skip the current song`,
          `\`${prefix}pause\` / \`${prefix}resume\` — pause or resume`,
          `\`${prefix}queue\` — show the queue`,
          `\`${prefix}stop\` — stop and clear the queue`,
          `\`${prefix}dc\` — disconnect the bot`,
        ].join('\n')
      );

    message.channel.send({ embeds: [embed] });
  },
};
