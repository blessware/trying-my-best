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

client.once('ready', async () => {
  console.log(`blessed online as ${client.user.tag}`);

  // 🔴 DND STATUS
  client.user.setPresence({
    status: 'dnd',
    activities: [{
      name: '@tryingmybest',
      type: ActivityType.Playing
    }]
  });

  // 🔐 ACCESS MESSAGE
  try {
    const channel = await client.channels.fetch(config.verifyChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid verify channel");
    } else {
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

      await channel.send({ embeds: [embed], components: [row] });
      console.log("✅ Verify message sent");
    }

  } catch (err) {
    console.log("verify error:", err.message);
  }

  // 🔑 KEY MESSAGE
  try {
    const channel = await client.channels.fetch(config.keyChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid key channel");
    } else {
      const embed = new EmbedBuilder()
        .setColor("#0a0a0a")
        .setTitle("ACCESS KEY")
        .setDescription("Use the key below:\n\n||trying||")
        .setFooter({ text: "@tryingmybest" });

      await channel.send({ embeds: [embed] });
      console.log("✅ Key message sent");
    }

  } catch (err) {
    console.log("key error:", err.message);
  }

  // 🔔 PING MESSAGE
  try {
    const channel = await client.channels.fetch(config.pingChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid ping channel");
    } else {
      const embed = new EmbedBuilder()
        .setColor("#0a0a0a")
        .setTitle("PING ROLES")
        .setDescription("Select what you want to be notified for.")
        .setFooter({ text: "@tryingmybest" });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ping_upload")
          .setLabel("Upload Pings")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("ping_announcement")
          .setLabel("Announcement Pings")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("ping_key")
          .setLabel("Key Changes Pings")
          .setStyle(ButtonStyle.Secondary)
      );

      await channel.send({ embeds: [embed], components: [row] });
      console.log("✅ Ping message sent");
    }

  } catch (err) {
    console.log("ping error:", err.message);
  }
});

// 🎯 BUTTON HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    // 🔐 ACCESS BUTTON
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

    // 🔔 PING BUTTONS
    if (interaction.customId.startsWith("ping_")) {
      const type = interaction.customId.split("_")[1];
      const roleId = config.pingRoles[type];

      if (!roleId) {
        return interaction.reply({
          content: "Role not configured.",
          ephemeral: true
        });
      }

      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);

        return interaction.reply({
          content: "Role removed.",
          ephemeral: true
        });

      } else {
        await member.roles.add(roleId);

        return interaction.reply({
          content: "Role added.",
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.error("❌ Interaction error:", err.message);

    if (!interaction.replied) {
      interaction.reply({
        content: "Something went wrong.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);
