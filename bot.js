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

  // 🔐 ACCESS MESSAGE
  try {
    console.log("Sending access message...");

    const channel = await client.channels.fetch(config.verifyChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid verify channel");
    } else {

      const messages = await channel.messages.fetch({ limit: 10 });
      const exists = messages.find(m =>
        m.author.id === client.user.id &&
        m.embeds.length &&
        m.embeds[0].title === "**SERVER ACCESS**"
      );

      if (exists) {
        console.log("⏭️ Access message already exists");
      } else {

        const embed = new EmbedBuilder()
          .setColor("#0a0a0a")
          .setTitle("**SERVER ACCESS**")
          .setDescription("Click below to access the server.")
          .setFooter({ text: "@tryingmybest" });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("verify_access")
            .setLabel("ACCESS")
            .setStyle(ButtonStyle.Secondary)
        );

        await channel.send({
          embeds: [embed],
          components: [row]
        });

        console.log("✅ Access message sent");
      }
    }

  } catch (err) {
    console.log("❌ Verify error:", err.message);
  }

  // 🔑 KEY MESSAGE
  try {
    console.log("Sending key message...");

    const channel = await client.channels.fetch(config.keyChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid key channel");
    } else {

      const messages = await channel.messages.fetch({ limit: 10 });
      const exists = messages.find(m =>
        m.author.id === client.user.id &&
        m.embeds.length &&
        m.embeds[0].title === "**ACCESS KEY**"
      );

      if (exists) {
        console.log("⏭️ Key message already exists");
      } else {

        const embed = new EmbedBuilder()
          .setColor("#0a0a0a")
          .setTitle("**ACCESS KEY**")
          .setDescription("**KEY** - ||**trying**||")
          .setFooter({ text: "@tryingmybest" });

        await channel.send({ embeds: [embed] });

        console.log("✅ Key message sent");
      }
    }

  } catch (err) {
    console.log("❌ Key error:", err.message);
  }

  // 🔔 PING MESSAGE
  try {
    console.log("Sending ping roles...");

    const channel = await client.channels.fetch(config.pingChannelId);

    if (!channel || !channel.isTextBased()) {
      console.log("❌ Invalid ping channel");
    } else {

      const messages = await channel.messages.fetch({ limit: 10 });
      const exists = messages.find(m =>
        m.author.id === client.user.id &&
        m.embeds.length &&
        m.embeds[0].title === "**PING ROLES**"
      );

      if (exists) {
        console.log("⏭️ Ping message already exists");
      } else {

        const embed = new EmbedBuilder()
          .setColor("#0a0a0a")
          .setTitle("**PING ROLES**")
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

        await channel.send({
          embeds: [embed],
          components: [row]
        });

        console.log("✅ Ping message sent");
      }
    }

  } catch (err) {
    console.log("❌ Ping error:", err.message);
  }
});

// 🎯 BUTTON HANDLER (UNCHANGED)
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
