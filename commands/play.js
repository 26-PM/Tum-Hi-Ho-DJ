module.exports = {
  name: 'play',
  aliases: ['p'],
  description: 'Play a song, or add it to the end of the queue',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send('⚠️ Join a voice channel first!');
    }

    const query = args.join(' ');
    if (!query) {
      return message.channel.send(`⚠️ Usage: \`.play <song name or URL>\``);
    }

    try {
      await message.client.distube.play(voiceChannel, query, {
        member: message.member,
        textChannel: message.channel,
      });
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Something went wrong trying to play that.');
    }
  },
};
