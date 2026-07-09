module.exports = {
  name: 'join',
  description: 'Join your current voice channel',
  async execute(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send('⚠️ Join a voice channel first!');
    }

    try {
      await message.client.distube.voices.join(voiceChannel);
      message.channel.send(`✅ Joined **${voiceChannel.name}**.`);
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Could not join that voice channel.');
    }
  },
};
