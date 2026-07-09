require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');

const PREFIX = process.env.PREFIX || '.';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // required to read "." prefix commands
  ],
});

// Load prefix commands from the commands/ folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
  // register any aliases too (e.g. "disconnect" -> "dc")
  if (command.aliases) {
    for (const alias of command.aliases) client.commands.set(alias, command);
  }
}

// Set up DisTube (handles voice connections, queues, and audio sources)
client.distube = new DisTube(client, {
  plugins: [new YtDlpPlugin(), new SoundCloudPlugin(), new SpotifyPlugin()],
  emitNewSongOnly: true,
});

// --- DisTube events: keep the text channel updated on what's happening ---
client.distube
  .on('playSong', (queue, song) => {
    queue.textChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Blurple')
          .setDescription(`🎶 Now playing **${song.name}** — requested by ${song.user}`)
          .setThumbnail(song.thumbnail),
      ],
    });
  })
  .on('addSong', (queue, song) => {
    queue.textChannel?.send(`✅ Added **${song.name}** to the queue.`);
  })
  .on('error', (channel, error) => {
    console.error(error);
    channel?.send('❌ An error occurred while playing that song.');
  })
  .on('finish', (queue) => {
    queue.textChannel?.send('🏁 Queue finished — add more songs with `.play`!');
  })
  .on('empty', (queue) => {
    queue.textChannel?.send('👋 Voice channel is empty, leaving...');
  })
  .on('disconnect', (queue) => {
    queue.textChannel?.send('🔌 Disconnected from the voice channel.');
  });

// --- Discord.js events ---
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag} — prefix: "${PREFIX}"`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.channel.send('❌ There was an error running that command.');
  }
});

client.login(process.env.DISCORD_TOKEN);
