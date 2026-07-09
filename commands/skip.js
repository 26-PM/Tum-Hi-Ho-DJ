module.exports = {
  name: 'skip',
  aliases: ['s'],
  description: 'Skip the current song',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (!queue) return message.channel.send('⚠️ Nothing is playing right now.');

    try {
      const skippedTo = await queue.skip();
      message.channel.send(`⏭️ Skipped! Now playing **${skippedTo.name}**.`);
    } catch (err) {
      message.channel.send('⚠️ No more songs in the queue to skip to.');
    }
  },
};
