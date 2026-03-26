const {
  Client,
  GatewayIntentBits,
  ActivityType
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log(`blessed online as ${client.user.tag}`);

  client.user.setPresence({
    status: 'dnd',
    activities: [{ name: '@tryingmybest', type: ActivityType.Playing }]
  });
});

// TEST BUTTON HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  await interaction.reply({
    content: "Button works.",
    ephemeral: true
  });
});

client.login(process.env.TOKEN);
