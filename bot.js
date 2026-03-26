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
    activities: [{ name: '@tryingmybest', type: ActivityType.Playing }]
  });

  // 🔐 ACCESS BUTTON
  try {
    const verifyChannel = await client.channels.fetch(config.verifyChannelId);

    const verifyEmbed = new EmbedBuilder()
      .setColor("#0a0a0a")
      .setTitle("**SERVER ACCESS**")
      .setDescription("Click below to access the server.")
      .setFooter({ text: "@tryingmybest" });

    const verifyRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_access")
        .setLabel("Access")
        .setStyle(ButtonStyle.Secondary)
    );

    await verifyChannel.send({
      embeds: [verifyEmbed],
      components: [verifyRow]
    });

  } catch (e) {
    console.log("verify error", e);
  }

  // 🔑 KEY MESSAGE
  try {
    const keyChannel = await client.channels.fetch(config.keyChannelId);

    const keyEmbed = new EmbedBuilder()
      .setColor("#0a0a0a")
      .setTitle("**ACCESS KEY**")
      .setDescription("Use the key below:\n\n||trying||")
      .setFooter({ text: "@tryingmybest" });

    await keyChannel.send({ embeds: [keyEmbed] });

  } catch (e) {
    console.log("key error", e);
  }

  // 🔔 PING ROLE BUTTONS
  try {
    const pingChannel = await client.channels.fetch(config.pingChannelId);

    const pingEmbed = new EmbedBuilder()
      .setColor("#0a0a0a")
      .setTitle("**PING ROLES**")
      .setDescription("Select what you want to be notified for.")
      .setFooter({ text: "@tryingmybest" });

    const pingRow = new ActionRowBuilder().addComponents(
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

    await pingChannel.send({
      embeds: [pingEmbed],
      components: [pingRow]
    });

  } catch (e) {
    console.log("ping error", e);
  }
});

// 🎯 BUTTON HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const member = await interaction.guild.members.fetch(interaction.user.id);

  try {
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

      if (!roleId) return;

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
    console.error(err);

    if (!interaction.replied) {
      interaction.reply({
        content: "Error occurred.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);
