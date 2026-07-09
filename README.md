# Discord Music Bot (Prefix Commands)

A music bot controlled with `.` prefix commands (like `.play`, `.skip`, `.dc`) instead of slash
commands — built with [discord.js](https://discord.js.org/) and [DisTube](https://distube.js.org/).

## Commands

| Command | Aliases | What it does |
|---|---|---|
| `.join` | | Joins your current voice channel |
| `.play <song>` | `.p` | Plays a song, or adds it to the end of the queue |
| `.insert <song>` | `.playnext`, `.in` | Adds a song to play **next** (right after the current song) |
| `.skip` | `.s` | Skips the current song |
| `.pause` | | Pauses playback |
| `.resume` | `.unpause` | Resumes playback |
| `.queue` | `.q` | Shows the current queue |
| `.stop` | | Stops playback and clears the queue |
| `.dc` | `.disconnect`, `.leave` | Disconnects the bot |
| `.help` | | Lists all commands |

You can change the prefix from `.` to anything else via the `PREFIX` variable in `.env`.

---

## 1. Create the bot on Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) -> **New Application**.
2. Go to the **Bot** tab -> **Reset Token** -> copy it. This is your `DISCORD_TOKEN`. Keep it secret.
3. **Important - this bot needs a privileged intent to read prefix commands:** still on the
   **Bot** tab, scroll to "Privileged Gateway Intents" and turn **ON** the **Message Content
   Intent** toggle, then save changes. Without this, the bot can see that a message was sent but
   not its actual text, so `.play` etc. won't work.
4. Go to **OAuth2 -> URL Generator**:
   - Scopes: `bot` (you do **not** need `applications.commands` since we're not using slash commands)
   - Bot permissions: `Connect`, `Speak`, `Send Messages`, `Embed Links`, `Read Message History`
   - Open the generated URL and invite the bot to your test server.

## 2. Set up the project (in Codespaces)

```bash
npm install
cp .env.example .env
# fill in DISCORD_TOKEN in .env (and optionally change PREFIX)
```

You also need **ffmpeg** and **yt-dlp** installed as system tools (not npm packages) for audio to work:

```bash
sudo apt-get update
sudo apt-get install -y ffmpeg python3-pip
pip install -U yt-dlp
```

Start the bot:

```bash
npm start
```

Go to your test server and try `.join` then `.play <song name>`.

> Codespaces note: the free tier is fine for **developing and testing**, but it stops when idle -
> not meant for 24/7 hosting. That's what the Oracle VPS is for.

## 3. Deploy to Oracle Cloud Free Tier VPS

Once it works locally, move it to your always-on VPS.

**On the VPS (SSH in first):**

```bash
sudo apt-get update
sudo apt-get install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs ffmpeg python3-pip
pip install -U yt-dlp

git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
cp .env.example .env
nano .env   # fill in your real DISCORD_TOKEN, save with Ctrl+O, exit with Ctrl+X
```

**Keep it running 24/7 with PM2:**

```bash
sudo npm install -g pm2
pm2 start index.js --name music-bot
pm2 save
pm2 startup   # follow the printed command to enable auto-start on VPS reboot
```

Useful PM2 commands:
```bash
pm2 logs music-bot     # view live logs
pm2 restart music-bot  # restart after you git pull new code
pm2 stop music-bot
```

**Updating the bot later:**
```bash
cd <your-repo>
git pull
npm install
pm2 restart music-bot
```

No inbound firewall ports need to be opened - the bot only makes outbound connections to Discord.

## Notes

- Message Content Intent is a **privileged intent**. For bots in fewer than 100 servers this is
  fine to enable without extra verification. If you ever grow past 100 servers, Discord requires
  bot verification to keep it enabled - not a concern for a personal/hobby bot.
- YouTube playback relies on `yt-dlp`. Occasionally run `pip install -U yt-dlp` again if playback
  suddenly breaks - YouTube changes things and yt-dlp updates to keep up.
- Spotify links get resolved to search queries and played from YouTube/SoundCloud, since Spotify
  doesn't allow direct audio streaming via bots.
- Next steps once the basics feel solid: persistent per-server settings (needs a database like
  SQLite/PostgreSQL), audio filters (bassboost, nightcore), volume control, and autoplay.
