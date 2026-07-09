module.exports = {
  name: 'pause',
  description: 'Pause the current song',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (!queue) return message.channel.send('⚠️ Nothing is playing right now.');

    queue.pause();
    message.channel.send('⏸️ Paused.');
  },
};
