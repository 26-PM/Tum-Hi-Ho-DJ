const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'Show the current song queue',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (!queue) return message.channel.send('⚠️ Nothing is playing right now.');

    const list = queue.songs
      .slice(0, 10)
      .map((song, i) => `${i === 0 ? '▶️' : `${i}.`} **${song.name}** — ${song.formattedDuration}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('🎵 Current Queue')
      .setDescription(list || 'Queue is empty.');

    message.channel.send({ embeds: [embed] });
  },
};
