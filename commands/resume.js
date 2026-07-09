module.exports = {
  name: 'resume',
  aliases: ['unpause'],
  description: 'Resume the current song',
  async execute(message) {
    const queue = message.client.distube.getQueue(message.guildId);
    if (!queue) return message.channel.send('⚠️ Nothing is playing right now.');

    queue.resume();
    message.channel.send('▶️ Resumed.');
  },
};
