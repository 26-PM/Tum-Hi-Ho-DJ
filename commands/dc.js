module.exports = {
  name: 'dc',
  aliases: ['disconnect', 'leave'],
  description: 'Disconnect the bot from voice and clear the queue',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (queue) queue.stop();

    try {
      message.client.distube.voices.leave(message.guildId);
      message.channel.send('👋 Disconnected.');
    } catch (err) {
      message.channel.send('⚠️ I\'m not in a voice channel.');
    }
  },
};
