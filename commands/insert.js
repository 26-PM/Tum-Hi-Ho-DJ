module.exports = {
  name: 'insert',
  aliases: ['playnext', 'in'],
  description: 'Insert a song to play next (right after the current song)',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send('⚠️ Join a voice channel first!');
    }

    const query = args.join(' ');
    if (!query) {
      return message.channel.send(`⚠️ Usage: \`.insert <song name or URL>\``);
    }

    try {
      await message.client.distube.play(voiceChannel, query, {
        member: message.member,
        textChannel: message.channel,
        position: 1, // insert right after the currently playing song
      });
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Something went wrong trying to insert that.');
    }
  },
};
