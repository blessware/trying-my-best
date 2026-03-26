console.log("🚀 BOT STARTING...");

const {
  Client,
  GatewayIntentBits,
  ActivityType
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ BOT ONLINE as ${client.user.tag}`);

  client.user.setPresence({
    status: 'dnd',
    activities: [{
      name: '@tryingmybest',
      type: ActivityType.Playing
    }]
  });
});

client.login(process.env.TOKEN);
