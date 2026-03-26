const {
  Client,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('clientReady', async () => {
  console.log(`✅ BOT ONLINE as ${client.user.tag}`);

  client.user.setPresence({
    status: 'dnd',
    activities: [{ name: '@tryingmybest', type: ActivityType.Playing }]
  });

  try {
    console.log("Sending access message...");

    const channel = await client.channels.fetch(config.verifyChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid verify channel");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#0a0a0a")
      .setTitle("SERVER ACCESS")
      .setDescription("Click below to access the server.")
      .setFooter({ text: "@tryingmybest" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_access")
        .setLabel("Access")
        .setStyle(ButtonStyle.Secondary)
    );

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("✅ Access message sent");

  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
});

// 🎯 BUTTON HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (interaction.customId === "verify_access") {
      if (member.roles.cache.has(config.verifyRoleId)) {
        await member.roles.remove(config.verifyRoleId);

        return interaction.reply({
          content: "❌ Access removed.",
          ephemeral: true
        });

      } else {
        await member.roles.add(config.verifyRoleId);

        return interaction.reply({
          content: "✅ Access granted.",
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.error("❌ Button error:", err.message);

    if (!interaction.replied) {
      interaction.reply({
        content: "Error occurred.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);
