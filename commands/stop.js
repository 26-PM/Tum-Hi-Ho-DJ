module.exports = {
  name: 'stop',
  description: 'Stop playback and clear the queue',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (!queue) return message.channel.send('⚠️ Nothing is playing right now.');

    queue.stop();
    message.channel.send('⏹️ Stopped playback and cleared the queue.');
  },
};
