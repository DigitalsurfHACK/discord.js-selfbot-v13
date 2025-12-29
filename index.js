"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false,
  intents: ["GUILDS", "GUILD_PRESENCES"]
});

// Track last known status
let lastStatus = null;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.username}`);

  const user = await client.users.fetch(process.env.USER_ID, { force: true });
  lastStatus = user.presence?.status ?? "offline";

  console.log("Initial status:", lastStatus);
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence?.userId) return;
  if (newPresence.userId !== process.env.USER_ID) return;

  const newStatus = newPresence.status;
  if (newStatus === lastStatus) return;

  lastStatus = newStatus;

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (!channel || !channel.send) return;

  const statusText = {
    online: "🟢 **ONLINE**",
    idle: "🌙 **IDLE**",
    dnd: "⛔ **DO NOT DISTURB**",
    offline: "⚫ **OFFLINE**"
  };

  await channel.send(
    ` **Status Update**\n<@${process.env.USER_ID}> is now ${statusText[newStatus] || newStatus}`
  );

  console.log(`Status changed → ${newStatus}`);
});

client.login(process.env.TOKEN);
